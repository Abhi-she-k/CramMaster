from qdrant_client import QdrantClient, models
from qdrant_client.models import Filter
import os
import uuid
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level
    format="%(asctime)s - %(levelname)s - %(message)s",  # Include timestamp, log level, and message
    datefmt="%Y-%m-%d %H:%M:%S",  # Timestamp format
)

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=os.environ.get("QDRANT_URL"),
    api_key=os.environ.get("QDRANT_API_KEY"),
)

def writeToQdrantDB(embeddings, fileName, UUID):
    logging.info("Starting to write data to Qdrant DB...")
    batch_size = 250

    collection_name = UUID+"chunks"

    try:
        # Only create the collection if it does not exist
        if not qdrant_client.collection_exists(collection_name=collection_name):
            qdrant_client.create_collection(
                collection_name=collection_name,
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
                collection_name=collection_name,
                points=batch
            )

        logging.info("Data written to Qdrant DB successfully.")
        return {
            "message": "Data written to Qdrant DB successfully.",
            "error": "False"
        }

    except Exception as e:
        logging.error(f"Error while writing to Qdrant DB: {str(e)}")
        return {
            "message": str(e),
            "error": "True"
        }


def queryQdrantDB(queryEmbedding, UUID):

    collection_name = UUID+"chunks"

    logging.info("Querying Qdrant DB...")
    try:
        res = qdrant_client.query_points(
            collection_name= collection_name,
            query=queryEmbedding,
            search_params=models.SearchParams(hnsw_ef=128, exact=False),
            limit=5,
        )
        logging.info("Query executed successfully.")
        return {
            "results": res,
            "error": "False"
        }
    
    except Exception as e:
        logging.error(f"Error while querying Qdrant DB: {str(e)}")
        return {
            "message": str(e),
            "error": "True"
        }
    
def global_clean_up():
    logging.info("Cleaning up Qdrant DB...")
    try:
        collections = qdrant_client.get_collections().collections

        for collection_info in collections:
            collection_name = collection_info.name
            print(f"Deleting collection: {collection_name}")
            qdrant_client.delete_collection(collection_name=collection_name)

        print("All collections deleted.")
    except Exception as e:
        logging.error(f"Error during cleanup: {str(e)}")\

def user_clean_up(UUID):
    logging.info(f"Cleaning up Qdrant DB for {UUID}...")
    try:
        collection_name = collection_name = UUID+"chunks"

        if qdrant_client.collection_exists(collection_name=collection_name):
            qdrant_client.delete(
                collection_name=collection_name,
                filter=Filter(must=[])  # empty filter = delete everything
            )
    except Exception as e:
        logging.error(f"Error during cleanup: {str(e)}")