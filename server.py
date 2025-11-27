from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables BEFORE configuring Gemini
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("❌ Missing GOOGLE_API_KEY in .env")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

# Use correct Gemini model (student plan supports this)
model = genai.GenerativeModel("gemini-flash-latest")


# Flask app setup
app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

SYSTEM_PROMPT = (
    "You are Symptomate, a concise, friendly medical-assistant AI.\n"
    "- Ask clarifying questions if the user's message is unclear.\n"
    "- Offer general, safe self-care guidance.\n"
    "- Always end with a disclaimer: 'I am not a doctor. This is not a replacement for professional medical advice.'"
)

@app.route("/")
def serve_index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def serve_static_files(filename):
    if os.path.exists(filename):
        return send_from_directory(".", filename)
    return "Not Found", 404


@app.route("/api/ai-response", methods=["POST"])
def ai_response():
    try:
        data = request.get_json()

        message = data.get("message")
        history = data.get("history", [])

        if not message:
            return jsonify({"error": "No message provided"}), 400

        # Build conversation in a single string (Gemini works best like this)
        conversation = SYSTEM_PROMPT + "\n\n"

        for item in history[-6:]:
            role = item.get("role", "user").upper()
            content = item.get("content", "")
            conversation += f"{role}: {content}\n"

        conversation += f"USER: {message}\nAI:"

        # Gemini API call
        response = model.generate_content(conversation)

        reply = response.text.strip()

        return jsonify({"reply": reply})

    except Exception as e:
        import traceback
        print("❌ Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/health")
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    app.run(host="127.0.0.1", port=port, debug=True)
