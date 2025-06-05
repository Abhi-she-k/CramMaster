from transformers import AutoTokenizer, GemmaForCausalLM
import os
from together import Together

from dotenv import load_dotenv
load_dotenv()

client = Together(api_key=os.environ.get("TOGETHER_AI_API_KEY"))

def generateAnswer(text, reference):

    reference = ", ".join([str(element) for element in reference])

    prompt = f"""
    
    You are a helpful assistant.
    Use only the information provided in the reference below to answer the question.
    If the answer is not found in the reference, respond with: "I don't know."

    Use all relevant information from the reference.
    If different pieces of information do not directly connect, present them in separate paragraphs.

    Also, mention quotes from the references when amswering the prompts

    Reference:
    {reference}

    Question:
    {text}
    """

    try:
        response = client.chat.completions.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
        )

        return {
            "message": response.choices[0].message.content,
            "error": "False"
        }

    except Exception as e:
        
        return {
            "message": str(e),
            "error": "True"
        }


    

