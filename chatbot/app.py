from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI
import dotenv
import os
import pandas as pd
from strip_markdown import strip_markdown
from pymongo import MongoClient
 
app = Flask(__name__)
CORS(app) # Enable CORS for all routes
 
dotenv.load_dotenv()
 
data_df = pd.DataFrame(columns = ["id", "title", "domain", "subdomain", "description"])
 
def retrieve_database():
    client = MongoClient(os.getenv("MONGODB_URL"))
 
    # Access a specific database
    db = client["sage_agents"]
 
    # Access a specific collection
    collection = db["agents"]
 
    # Example: Insert a document
    #collection.insert_one({"name": "Alice", "age": 25})
 
    # Example: Find a document
    result = collection.find()
    ids = []
    titles = []
    domains = []
    subdomains = []
    descriptions = []
 
    for doc in result:
        ids.append(doc["id"])
        titles.append(doc["title"])
        domains.append(doc["domain"])
        subdomains.append(doc["domain"])
        descriptions.append(doc["description"])
 
    data_df["id"] = ids
    data_df["title"] = titles
    data_df["domain"] = domains
    data_df["subdomain"] = subdomains
    data_df["description"] = descriptions
 
 
def retrieve_data(query, max_results = 5):
    """
    Retrieve data from the DataFrame based on a query.
    Returns up to max_results relevant rows.
    """
    results = []
    query_lower = query.lower()
   
    for index, row in data_df.iterrows():
        if any(query_lower in str(value).lower() for value in row):
            context_row = " | ".join([str(c + " " + row[c]) for c in data_df.columns if str(row[c]).strip()])
            if context_row:
                results.append(context_row)                
            if len(results) >= max_results:
                break
   
    return "\n".join(results) if results else " "
 
 
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data['userMessage']['text'].lower()
 
    client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
 )
   
    query = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user",
                 "content": f"""Find keywords in this query: {user_message} and return only the keywords.
                        Ignore common words used for greeting or general conversation.
                        Also ignore words like domain, ai, agent, use case and focus only on more
                        specific keywords that can be used to retrieve relevant information.
                        Give only the words themselves separated by commas, without any additional text or explanation."""}
                ])
   
    keywords = query.choices[0].message.content.split(",")
 
    final_keywords = []
 
    for keyword in keywords:
        word = keyword.strip()
        final_keywords.append(word)
   
    print("Final Keywords:", final_keywords)
   
    context = ""
 
    for keyword in final_keywords:
        context += retrieve_data(keyword) + "\n"
       
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
   
    final_answer = str(strip_markdown(answer))
   
    return jsonify({"response": final_answer})
 
retrieve_database()

if __name__ == "__main__":
    app.run(debug=True)
