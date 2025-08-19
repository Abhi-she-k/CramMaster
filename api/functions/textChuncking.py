import pdfplumber
import spacy
import re
import logging

logging.basicConfig(
    level=logging.INFO,  
    format="%(asctime)s - %(levelname)s - %(message)s",  
    datefmt="%Y-%m-%d %H:%M:%S", 
)

nlp = spacy.load("en_core_web_trf", disable=["ner", "tagger", "lemmatizer"])

def textChuncking(pdfFilePath):
    logging.info(f"Starting text chunking for file: {pdfFilePath}")
    try:
        all_text = []
        with pdfplumber.open(pdfFilePath) as pdf:

            for page_num, page in enumerate(pdf.pages, start=1):

                page_text = page.extract_text() or ""
                
                page_text = re.sub(r'-\n', ' ', page_text)
                page_text = re.sub(r'\n{2,}', '\n\n', page_text)
                page_text = re.sub(r'[ \t]+', ' ', page_text)
                page_text = page_text.lower()


                all_text.append(page_text.strip())

        full_text = "\n\n".join(all_text)

        doc = nlp(full_text)
        sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

        chunks = []
        chunk_size = 5
        step = 1    

        for i in range(0, len(sentences), step):
            chunk = " ".join(sentences[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)

        logging.info(f"Created {len(chunks)} chunks from the text.")

        return {
            "chunks": chunks,
            "error": "False"
        }

    except Exception as e:
        logging.error(f"Error during text chunking: {str(e)}")
        return {
            "message": str(e),
            "error": "True"
        }
