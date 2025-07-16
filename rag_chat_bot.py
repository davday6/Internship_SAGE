from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from transformers import pipeline
import glob

app = Flask(__name__)
CORS(app)

# Only load the 7 specified CSV files in the SAGE internship folder
csv_files = [
    "Main.csv",
    "Lab.csv",
    "Jump_Start.csv",
    "Life_and_Annuity.csv",
    "SAGE.csv",
    "Sandbox.csv",
    "SWE.csv"
]
csv_data = []
for file in csv_files:
    try:
        df = pd.read_csv(file, dtype=str, keep_default_na=False)
        csv_data.append(df)
    except Exception as e:
        print(f"Error loading {file}: {e}")

# Load Hugging Face model (using a general-purpose model for now)
rag_pipeline = pipeline("text-generation", model="distilgpt2")

def retrieve_context(query, max_results=5):
    """
    Simple keyword search across all CSVs. Returns up to max_results relevant rows as context.
    """
    results = []
    query_lower = query.lower()
    for df in csv_data:
        for col in df.columns:
            matches = df[df[col].str.lower().str.contains(query_lower, na=False)]
            for _, row in matches.iterrows():
                context_row = " | ".join([str(row[c]) for c in df.columns if str(row[c]).strip()])
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
    user_message = data.get("message", "")

    # Retrieve context from CSVs
    context = retrieve_context(user_message)

    # Compose prompt for LLM
    prompt = f"Context: {context}\nQuestion: {user_message}\nAnswer:"
    llm_response = rag_pipeline(prompt, max_length=500, num_return_sequences=1)[0]['generated_text']

    # Post-process response (strip prompt from output)
    answer = llm_response.replace(prompt, "").strip()

    return jsonify({"response": answer})

if __name__ == "__main__":
    app.run(debug=True)
