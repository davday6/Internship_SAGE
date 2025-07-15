from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").lower()

    if "hello" in user_message or "hi" in user_message:
        response = "Hello! How can I help you today?"
    elif "help" in user_message:
        response = "Sure! I'm here to assist you. What do you need help with?"
    elif "bye" in user_message:
        response = "Goodbye! Have a great day!"
    else:
        response = "I'm not sure how to respond to that. Try asking something else!"
    
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
