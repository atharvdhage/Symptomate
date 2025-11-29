from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import time
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

# Health log file
LOG_FILE = "health_log.json"

SYSTEM_PROMPT = (
    "You are Symptomate — an agentic, safety-focused AI health assistant. "
    "Your job is to provide *symptom triage*, not diagnosis.\n\n"

    "CORE BEHAVIOR:\n"
    "- Be concise, empathetic, and easy to understand.\n"
    # FIX 1: CONDITIONAL LOGIC FOR QUESTIONS
    "- DATA SUFFICIENCY CHECK: If the user has provided a location and duration of the symptom, assume you have enough info to triage.\n"
    "- FOLLOW-UP RULE: Ask clarifying questions ONLY if the input is extremely vague (e.g., just saying 'hurt' or 'pain').\n"
    "- MAX LOOPS: Never ask follow-up questions more than once. If you have already asked a question, you MUST provide the triage JSON in the next turn.\n"
    "- Provide general wellness guidance only. Never give clinical instructions, drug names, or dosages.\n"
    "- Always end your chat message with this line:\n"
    "  'I am not a doctor. This is not a substitute for professional medical advice.'\n\n"

    "OUTPUT FORMAT (MANDATORY):\n"
    "Return a JSON object. "
    # FIX 2: HANDLING THE 'ASKING' STATE
    "If you need to ask a clarifying question, set 'stage' to 'ask' and leave other fields null or empty. "
    "If you are ready to give advice, set 'stage' to 'triage'.\n"
    "{\n"
    '  "stage": "ask | triage",\n'
    '  "message": "chat reply to user (question or advice)",\n'
    '  "severity": "low | moderate | high | emergency",\n'
    '  "flags": ["monitor", "home-care", "see-doctor", "emergency"],\n'
    '  "causes": ["possible cause 1", "possible cause 2"],\n'
    '  "suggestions": ["step 1", "step 2", "step 3"]\n'
    "}\n\n"

    "RULES FOR TRIAGE:\n"
    "- severity:\n"
    "  • low = mild, temporary symptoms\n"
    "  • moderate = uncomfortable symptoms but not dangerous\n"
    "  • high = strong symptoms that likely need medical evaluation\n"
    "  • emergency = chest pain, trouble breathing, sudden confusion, severe bleeding\n\n"

    "- flags:\n"
    "  • 'monitor' for mild symptoms\n"
    "  • 'home-care' when self-care is enough\n"
    "  • 'see-doctor' when symptoms require professional attention but not urgent\n"
    "  • 'emergency' only for life-threatening signs\n\n"

    "- causes:\n"
    "  • Provide 2–4 broad, non-diagnostic possibilities\n"
    "  • Never mention rare diseases unless clearly relevant\n\n"

    "- suggestions:\n"
    "  • Provide 3–5 safe, general steps (hydration, rest, cold compress, avoid triggers)\n"
    "  • Never mention medications, supplements, labs, or clinical tests\n\n"

    "IMPORTANT:\n"
    "- The JSON must ALWAYS be valid and parsable.\n"
    "- If stage is 'triage', 'severity' and 'suggestions' are REQUIRED.\n"
)

@app.route("/")
def serve_index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def serve_static_files(filename):
    if os.path.exists(filename):
        return send_from_directory(".", filename)
    return "Not Found", 404


def save_log(entry):
    try:
        if os.path.exists(LOG_FILE):
            data = json.load(open(LOG_FILE))
        else:
            data = []
        data.append(entry)
        json.dump(data, open(LOG_FILE, "w"), indent=2)
    except:
        pass


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

        # Gemini API call with structured JSON output
        response = model.generate_content(
            conversation,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            }
        )

        # Parse JSON response
        triage = json.loads(response.text.strip())

        # Save to health log
        save_log({
            "timestamp": time.time(),
            "user_message": message,
            "triage": triage
        })

        return jsonify({
            "reply": triage.get("message", ""),
            "triage": {
                "severity": triage.get("severity", "low"),
                "flags": triage.get("flags", []),
                "possible_causes": triage.get("causes", []),
                "suggestions": triage.get("suggestions", [])
            }
        })

    except Exception as e:
        import traceback
        print("❌ Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/history", methods=["GET"])
def history():
    if not os.path.exists(LOG_FILE):
        return jsonify([])
    try:
        with open(LOG_FILE, "r") as f:
            data = json.load(f)
        return jsonify(data)
    except:
        return jsonify([])


@app.route("/health")
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    app.run(host="127.0.0.1", port=port, debug=True)
