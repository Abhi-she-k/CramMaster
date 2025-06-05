
# Crammaster

### **1\. Document Ingestion & Indexing (`/learn` endpoint)**

-   **PDF Upload:** User uploads PDF files to the server.
-   **Text Chunking:** Each PDF is split into manageable text chunks using [textChuncking](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).
-   **Embedding Generation:** Each chunk is converted into a vector embedding via [getVectorEmbedding](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).
-   **Vector Storage:** Embeddings and their corresponding text/file metadata are stored in a Qdrant vector database using [writeToQdrantDB](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

* * * * *

### **2\. Retrieval-Augmented Generation (RAG) Workflow (`/ask` endpoint)**

-   **User Query:** User submits a question.
-   **Query Embedding:** The question is embedded using [getVectorEmbedding](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).
-   **Semantic Retrieval:** The embedding is used to query Qdrant ([queryQdrantDB](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)) for the most relevant document chunks.
-   **Context Assembly:** Retrieved chunks (references) are collected and formatted.
-   **Answer Generation:** The question and retrieved references are passed to a language model ([generateAnswer](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)), which generates a grounded answer using only the retrieved context.
-   **Reference Return:** The answer and the references used are returned to the user.

* * * * *

### **3\. Cleanup (`/cleanup` endpoint)**

-   **Database Cleanup:** Removes all stored vectors and metadata from Qdrant using [cleanUP](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

* * * * *

### **Key RAG Components in Your Code**

-   **Retriever:** Qdrant vector search ([queryQdrantDB](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html))
-   **Augmentation:** Retrieved text chunks (references)
-   **Generator:** Language model ([generateAnswer](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)) that uses both the question and retrieved context

* * * * *

### **Endpoints**

-   `GET /learn` --- Ingest and index documents (RAG: Build knowledge base)
-   `POST /ask/` --- Answer questions using RAG (retrieve + generate)
-   `GET /cleanup` --- Remove all indexed data

* * * * *

**This architecture enables CramMaster.ai to answer questions with high accuracy and transparency, always grounding responses in your uploaded documents.**

1\. Clone the Repository
------------------------
```
git clone https://github.com/yourusername/crammaster.ai.git

cd crammaster.ai
```
* * * * *

2\. Backend (FastAPI) Setup
---------------------------

### a. Create and Activate a Virtual Environment
```
cd CramMaster/src/api

python -m venv .venv
```
# On Windows:
```
.venv\Scripts\activate
```
# On macOS/Linux:
```
source .venv/bin/activate
```
### b. Install Python Dependencies
```
pip install -r requirements.txt
```
### c. Set Up Environment Variables
```
Create a `.env` file in [api](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with your secrets (example):
```
QDRANT_URL=http://localhost:6333

QDRANT_API_KEY=your_qdrant_api_key

TOGETHER_AI_API_KEY=your_together_api_key
```
### d. Run the FastAPI Server
```
uvicorn main:app --reload
```
> Make sure you are in the [api](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) directory.

* * * * *

3\. Frontend (Next.js) Setup
----------------------------

### a. Install Node.js Dependencies
```
cd ../../../app

npm install
```
### b. Run the Next.js Development Server
```
npm run dev

> The app will be available at [http://localhost:3000](vscode-file://vscode-app/c:/Users/abhis/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
```
* * * * *

4\. Qdrant Vector Database
--------------------------
```
-   If running locally, start Qdrant (Docker example):

docker run -p 6333:6333 qdrant/qdrant

-   Or use your cloud Qdrant instance and update `QDRANT_URL` and `QDRANT_API_KEY` in your `.env`.
```
* * * * *

5\. Usage
---------

-   **Upload PDFs** via the web interface.
-   Click **Learn** to process and index documents.
-   Use the **Ask** feature to query your documents using RAG (Retrieval-Augmented Generation).
-   Use **Cleanup** to clear the vector database if needed.

* * * * *

6\. Troubleshooting
-------------------

-   Ensure all environment variables are set correctly.
-   Make sure Qdrant is running and accessible.
-   Check the terminal for errors from either the backend or frontend.

* * * * *

**Enjoy using CramMaster.ai!**\
This setup enables a full RAG pipeline for document Q&A with FastAPI and Next.js.
