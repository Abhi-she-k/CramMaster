import os
import logging
from fastapi import UploadFile, File, FastAPI, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from os import listdir
from os.path import isfile, join
from pydantic import BaseModel
from dotenv import load_dotenv

# Local imports
from functions.textChuncking import textChuncking
from functions.getVectorEmbedding import getVectorEmbedding
from functions.vectorDB import writeToQdrantDB, queryQdrantDB, cleanUP
from functions.generateAnswer import generateAnswer

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Validate UPLOAD_DIR env variable
UPLOAD_DIR = os.getenv("UPLOAD_DIR")

if not UPLOAD_DIR:
    raise RuntimeError("UPLOAD_DIR is not set in the environment")


# Pydantic model for POST /ask
class AskRequest(BaseModel):
    data: str


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/learn")
def learn():
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

            db_write = writeToQdrantDB(vector_embeddings, file)
            if db_write.get("error") == "True":
                logging.error(f"DB write failed for {file}: {db_write.get('message')}")
                return {"message": db_write.get("message"), "status": 400}

    return {"message": "Learn process completed successfully.", "status": 200}


@app.post("/ask")
def ask(request: AskRequest):
    user_question = request.data
    res = []


    query_embedding = getVectorEmbedding([user_question])
    if query_embedding.get("error") == "True":
        return {"message": query_embedding.get("message"), "status": 400}

    db_query = queryQdrantDB(query_embedding.get("embeddings")[0])

    for results in db_query.get("results", []):
        for result in results[1]:
            res.append({
                "reference": result.payload["text"],
                "file": result.payload["fileName"]
            })

    answer = generateAnswer(user_question, res)
    if answer.get("error") == "True":
        return {"message": answer.get("message"), "status": 400}

    return {
        "answer": answer["message"],
        "references": res,
        "status": 200
    }


@app.get("/cleanup")
def cleanup():
    try:
        cleanUP()
        return {"message": "Cleanup completed successfully", "status": 200}
    except Exception as e:
        logging.error("Cleanup failed: %s", str(e))
        return {"message": "Cleanup failed", "error": str(e), "status": 500}


@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    
    for file in files:
        content = await file.read()
        with open(os.path.join(UPLOAD_DIR, file.filename), "wb") as f:
            f.write(content)
    return {"message": "Files uploaded", "status": 200}
