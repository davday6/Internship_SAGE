from flask import Flask, request, jsonify
from flask_cors import CORS
#from transformers import pipeline
from openai import AzureOpenAI
import dotenv
#import transformers
#import torch
import os
import pandas as pd

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

dotenv.load_dotenv()

csv_files = [
    #"Main.csv",
    "Lab.csv",
    "Jump_Start.csv",
    "Life_and_Annuity.csv",
    #"SAGE.csv",
    #"Sandbox.csv",
    #"SWE.csv"
]

csv_data = []
for file in csv_files:
    try:
        df = pd.read_csv(file, header = 0)
        csv_data.append(df)
    except Exception as e:
        print(f"Error loading {file}: {e}")


def retrieve_context(query, max_results=5):
    """
    Simple keyword search across all CSVs. Returns up to max_results relevant rows as context.
    """
    results = []
    query_lower = query.lower()
    for df in csv_data:
        for col in df.columns:
            matches = df[df[col].str.contains(query_lower, case = False, na=False)]
            for _, row in matches.iterrows():
                context_row = " | ".join([str(c + " " + row[c]) for c in df.columns if str(row[c]).strip()])
                if context_row:
                    results.append(context_row)
                if len(results) >= max_results:
                    break
            if len(results) >= max_results:
                break
        if len(results) >= max_results:
            break
    return "\n".join(results) if results else "No relevant context found."


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").lower()
    
    client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
 )
    
    query = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", 
                 "content": f"Find keywords in this query: {user_message} and return only the keywords."}
                ])

    keywords = query.choices[0].message.content.split(",")

    final_keywords = []

    for keyword in keywords:
        if keyword != "use" and keyword != "case":
            final_keywords.append(keyword.strip())
    
    print(keywords)
    
    context = ""

    for keyword in final_keywords:
        context += retrieve_context(keyword) + "\n"
        
    print("Context:\n", context)
    
    response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"""You are a helpful chatbot that tells the user the information 
                 that they asked for based on the context provided {context}. Be sure to use only 
                 the information in the provided context to answer the question. Limit your response to 50 words."""},
                {"role": "user", "content": user_message}
                ])

    answer = response.choices[0].message.content

    #response = question_answerer(question = user_message, context = context)
    #answer = response["answer"]
    
    # if "hello" in user_message or "hi" in user_message:
    #     response = "Hello! How can I help you today?"
    # elif "help" in user_message:
    #     response = "Sure! I'm here to assist you. What do you need help with?"
    # elif "bye" in user_message:
    #     response = "Goodbye! Have a great day!"
    # else:
    #     response = "I'm not sure how to respond to that. Try asking something else!"
    
    return jsonify({"response": answer})

if __name__ == "__main__":
    app.run(debug=True)
