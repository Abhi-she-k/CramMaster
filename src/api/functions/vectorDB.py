from qdrant_client import QdrantClient, models
import os

import uuid

qdrant_client = QdrantClient(
    url=os.environ.get("QDRANT_URL"),
    api_key=os.environ.get("QDRANT_API_KEY"),
)

def writeToQdrantDB(embeddings, fileName):
   
    print("Writing to Qdrant DB...")

    batch_size = 250

    try:
        # Only create the collection if it does not exist
        if not qdrant_client.collection_exists(collection_name="sentences"):

            qdrant_client.create_collection(
                collection_name="sentences",
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
            )

        points = [
            {
                "id": str(uuid.uuid4()),
                "vector": embeddings["embeddings"][i],
                "payload": {
                    "text": embeddings["sentences"][i],
                    "fileName": fileName
                }
            }
            for i in range(len(embeddings["embeddings"]))
        ]

        # Batch upsert for large datasets
        for i in range(0, len(points), batch_size):
            
            batch = points[i:i+batch_size]
            
            qdrant_client.upsert(
                collection_name="sentences",
                points=batch
            )


        print("Data written to Qdrant DB successfully.")

        return {
            "message": "Data written to Qdrant DB successfully.",
            "error": "False"
        }

    except Exception as e:
        return {
            "message": str(e),
            "error": "True"
        }


def queryQdrantDB(queryEmbedding):
    print("Querying Qdrant DB...")
    try:
      
        res = qdrant_client .query_points(
            collection_name="sentences",
            query=queryEmbedding,
            search_params=models.SearchParams(hnsw_ef=128, exact=False),
            limit=5,
        )

        return {
            "results": res,
            "error": "False"
        }
    
    except Exception as e:
        return {
            "message": str(e),
            "error": "True"
        }
    
def cleanUP():

    if qdrant_client.collection_exists(collection_name="sentences"):

        qdrant_client.delete_collection(
            collection_name="sentences"
        )