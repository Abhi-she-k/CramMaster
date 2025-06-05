import pdfplumber
import spacy


nlp = spacy.load("en_core_web_trf")

def textChuncking(pdfFilePath):
    
    try:

        with pdfplumber.open(pdfFilePath) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()

        text = text.replace("\n"," ")


        doc = nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        chunks = []

        for i in range(0,len(sentences), 2):
            chunk = " ".join(sentences[i:i+6])
            chunks.append(chunk)

        return {
            "chunks": chunks,
            "error": "False"
        }

    except Exception as e:
        
        return {
            "message": str(e),
            "error": "True"        
        }
        


