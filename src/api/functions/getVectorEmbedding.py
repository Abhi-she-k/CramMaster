from sentence_transformers import SentenceTransformer

model = SentenceTransformer('sentence-transformers/multi-qa-MiniLM-L6-cos-v1')

def getVectorEmbedding(text):

    sentences = []
    embeddings = [] 

    for i in range(len(text)):
        
        sentence = (text[i]).strip()

        sentences.append(sentence)

        
    try:
        embeddings = model.encode(sentences, batch_size=32, show_progress_bar=True)

    except Exception as e:
        return {
            "message": str(e),
            "error": "True"
        }
                
            
    return {
        "sentences": sentences,
        "embeddings": embeddings,
        "error": "False"
    }
    
 
    





