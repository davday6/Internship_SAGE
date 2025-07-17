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
    "Sandbox.csv"
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
    Improved keyword search across all CSVs. Skips 'Unnamed' columns and empty values, deduplicates context rows.
    """
    results = set()
    query_lower = query.lower()
    for df in csv_data:
        # Only use columns with meaningful names
        valid_cols = [col for col in df.columns if not col.lower().startswith('unnamed')]
        for col in valid_cols:
            matches = df[df[col].str.contains(query_lower, case=False, na=False)]
            for _, row in matches.iterrows():
                # Only include non-empty, non-'Unnamed' columns
                context_row = " | ".join([
                    f"{c}: {row[c]}" for c in valid_cols if str(row[c]).strip() and not c.lower().startswith('unnamed')
                ])
                if context_row and context_row not in results:
                    results.add(context_row)
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

    # System prompt for LLM
    system_prompt = (
        "You are a helpful assistant that helps navigate content of the website. "
        "Use the context provided to aid in the queries posed.\n"
    )

    # Retrieve context from CSVs
    context = retrieve_context(user_message)

    # Compose prompt for LLM
    prompt = f"{system_prompt}Context: {context}\nQuestion: {user_message}\nAnswer:"
    llm_response = rag_pipeline(prompt, max_length=500, num_return_sequences=1)[0]['generated_text']

    # Post-process response (strip prompt from output)
    answer = llm_response.replace(prompt, "").strip()

    return jsonify({"response": answer})

if __name__ == "__main__":
    app.run(debug=True)
