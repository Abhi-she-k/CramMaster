from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from os import listdir
from os.path import isfile, join

from functions.textChuncking import textChuncking
from functions.getVectorEmbedding import getVectorEmbedding
from functions.vectorDB import writeToQdrantDB
from functions.vectorDB import queryQdrantDB
from functions.vectorDB import cleanUP
from functions.generateAnswer import generateAnswer

from pydantic import BaseModel

from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/"],
)

class AskRequest(BaseModel):
    data: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/learn")
def learn():
        
    path = 'C:/Users/abhis/Desktop/Projects/crammaster.ai/CramMaster/tmp/uploads'

    for file in listdir(path):
        
        if (isfile(join(path, file))):
            
            chunksResponse = textChuncking(join(path, file))

            if (chunksResponse.get("error") == "True"):
                return {
                    "message": chunksResponse.get("message"),
                    "status": "400"
                }

            vectorEmbeddings = getVectorEmbedding(chunksResponse.get("chunks"))

            if (vectorEmbeddings.get("error") == "True"):
                return {
                    "message": vectorEmbeddings.get("message"),
                    "status": "400"
                }


            dbWrite = writeToQdrantDB(vectorEmbeddings, file)

            if(dbWrite.get("error") == "True"):
                return {
                    "message": dbWrite.get("message"),
                    "status": "400"
                }
        

    return {
        "message": "Learn Process Completed Successfully.",
        "status": "200"
    }

@app.post("/ask/")
def ask(question: AskRequest):

    res = [] 
    
    question = question.data

    queryEmbedding = getVectorEmbedding([question])

    if (queryEmbedding.get("error") == "True"):
        return {
            "message": queryEmbedding.get("message"),
            "status": "400"
        }
    
    dbQuery = queryQdrantDB(queryEmbedding.get("embeddings")[0])

    # print("DB Query: ", (dbQuery["results"]))

    for results in (dbQuery["results"]):
        for result in results[1]:
            print("Result: ", result.payload)
            res.append({"reference": result.payload["text"],
                        "file": result.payload["fileName"]})

    answer = generateAnswer(question,res)

    if(answer.get("error") == "True"):
        return {
            "message": queryEmbedding.get("message"),
            "status": "400"
        }
    else:      
        return {
            "answer": answer["message"], 
            "references": res
        }
    
@app.get("/cleanup")
def cleanup():

    cleanUP()
    
    
    

   
