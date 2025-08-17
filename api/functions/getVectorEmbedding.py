import logging
from sentence_transformers import SentenceTransformer

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level
    format="%(asctime)s - %(levelname)s - %(message)s",  # Include timestamp, log level, and message
    datefmt="%Y-%m-%d %H:%M:%S",  # Timestamp format
)

model = SentenceTransformer('sentence-transformers/multi-qa-MiniLM-L6-cos-v1')

def getVectorEmbedding(text):
    logging.info("Starting the process to convert text to embeddings.")


    sentences = []
    embeddings = [] 

    for i in range(len(text)):
        sentence = (text[i]).strip()
        sentences.append(sentence)


    try:
        embeddings = model.encode(sentences, batch_size=32, show_progress_bar=True)
        logging.info("Successfully converted text to embeddings.")
    except Exception as e:
        logging.error(f"Error while converting text to embeddings: {str(e)}")
        return {
            "message": str(e),
            "error": "True"
        }
                
    return {
        "sentences": sentences,
        "embeddings": embeddings,
        "error": "False"
    }








