import os
import logging
from fastapi import UploadFile, File, FastAPI
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from os import listdir
from os.path import isfile, join
from pydantic import BaseModel
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler


from functions.textChuncking import textChuncking
from functions.getVectorEmbedding import getVectorEmbedding
from functions.vectorDB import writeToQdrantDB, queryQdrantDB, global_clean_up, user_clean_up
from functions.generateAnswer import generateAnswer

load_dotenv()

app = FastAPI()
scheduler = BackgroundScheduler()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR")

if not UPLOAD_DIR:
    raise RuntimeError("UPLOAD_DIR is not set in the environment")

class RequestData(BaseModel):
    data: str

class RequestDataAsk(BaseModel):
    UUID: str
    question: str

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/learn")
def learn(request: RequestData):

    UUID = request.data

    for file in listdir(UPLOAD_DIR):
        file_path = join(UPLOAD_DIR, file)

        if isfile(file_path):
            chunks_response = textChuncking(file_path)
            if chunks_response.get("error") == "True":
                logging.error(f"Chunking failed for {file}: {chunks_response.get('message')}")
                return {"message": chunks_response.get("message"), "status": 400}

            vector_embeddings = getVectorEmbedding(chunks_response.get("chunks"))
            if vector_embeddings.get("error") == "True":
                logging.error(f"Embedding failed for {file}: {vector_embeddings.get('message')}")
                return {"message": vector_embeddings.get("message"), "status": 400}

            db_write = writeToQdrantDB(vector_embeddings, file, UUID)
            if db_write.get("error") == "True":
                logging.error(f"DB write failed for {file}: {db_write.get('message')}")
                return {"message": db_write.get("message"), "status": 400}

    return {"message": "Learn process completed successfully.", "status": 200}


@app.post("/ask")
def ask(request: RequestDataAsk):
    
    UUID = request.UUID
    user_question = request.question
    references = []

    query_embedding = getVectorEmbedding([user_question])
    if query_embedding.get("error") == "True":
        return {"message": query_embedding.get("message"), "status": 400}

    db_query = queryQdrantDB(query_embedding.get("embeddings")[0], UUID)

    for results in db_query.get("results", []):
        for result in results[1]:

            references.append({
                "reference": result.payload["text"],
                "file": result.payload["fileName"],
                "score": result.score
            })

    print(references)

    if(references[0]["score"] < 0.5):
        return{
            "answer": "This question does not appear to be relevant to the provided references. Could you please provide a question that is more closely aligned with the uploaded topics?",
            "references": [],
            "status": 200
        }

    answer = generateAnswer(user_question, references)
    if answer.get("error") == "True":
        return {"message": answer.get("message"), "status": 400}

    return {
        "answer": answer["message"],
        "references": references,
        "status": 200
    }

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    
    for file in files:
        content = await file.read()
        with open(os.path.join(UPLOAD_DIR, file.filename), "wb") as f:
            f.write(content)
    return {"message": "Files uploaded", "status": 200}

@app.post("/user_cleanup")
def user_cleanup(request: RequestData):

    UUID = request.data

    try:
        user_clean_up(UUID)
        return {"message": "Cleanup completed successfully", "status": 200}
    except Exception as e:
        logging.error("Cleanup failed: %s", str(e))
        return {"message": "Cleanup failed", "error": str(e), "status": 500}
    

def cleanup():
    try:
        global_clean_up()
        return {"message": "Cleanup completed successfully", "status": 200}
    except Exception as e:
        logging.error("Cleanup failed: %s", str(e))
        return {"message": "Cleanup failed", "error": str(e), "status": 500}
    
def scheduled_cleanup():
    response = cleanup()   
    print(f"{response}")

@app.on_event("startup")
def start_scheduler():
    scheduled_cleanup()
    scheduler.add_job(scheduled_cleanup, "interval", hours=6)
    scheduler.start()

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()