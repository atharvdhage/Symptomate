People often turn to the internet to self-diagnose, leading to misinformation and panic. There is no interactive system that can ask relevant questions, retrieve reliable medical information, and guide users toward safe triage decisions.
- Our project aims to provide an AI-powered health assistant that acts as an                 intelligent agent, guiding users through symptom understanding and triage with transparency and safety.

**Solution description:**

Symptomate is an Agentic AI-powered health assistant that interacts with users to understand their symptoms, asks relevant follow-up questions, retrieves trusted medical information, and provides safe, triage-based guidance.

When users enter their symptoms, Symptomate's intelligent agent actively plans its next steps — it generates clarifying questions to refine understanding (e.g., “Do you have a fever?” or “How long have you felt this pain?”). Based on the user’s responses, the system searches verified medical sources such as NHS, WHO, and Mayo Clinic to explain possible causes and classify the situation into safe categories like:

- Self-care at home
- Consult a doctor soon
- Seek emergency help immediately

This autonomous decision-making flow — **perceive** →** plan** → **retrieve** → **act **— demonstrates Agentic AI behavior, where the system dynamically reasons and adapts rather than just answering passively like a typical chatbot.

Symptomate emphasizes **safety**, **transparency**, and **accessibility**. Every response includes sources and a disclaimer that it is not a medical diagnosis but educational triage guidance.

**Key Features:**

 - **Agentic AI Loop:** The assistant autonomously plans follow-up questions and retrieves relevant medical content.

 - **Knowledge Retrieval:** Uses a retrieval module to fetch information from trusted healthcare sources.

 - **Safe Triage Recommendation:** Outputs one of three outcomes (Self-care, See Doctor, Emergency) with clear rationale.

 - **Web-based UI:** Simple HTML/JS interface for symptom entry and conversation flow.

 - **Explainable Outputs:** Displays sources and confidence levels for every suggestion.

 - **Ethical Safeguards:** Includes disclaimers, red-flag detection, and transparency about limitations.

**Challenges Faced:**

- Implementing Agentic Behavior: Designing a multi-step reasoning flow where        the AI autonomously asks questions and refines understanding was complex with limited time.

- Ensuring Safety & Reliability: Avoiding overconfident or incorrect medical responses required careful prompt engineering and grounding to trusted data.

- Data Retrieval: Creating a small but reliable medical knowledge base (NHS/WHO data) and integrating it efficiently within time constraints.

- Limited AI/ML Experience: As a beginner, understanding LLM integration, API calls, and agent workflows required rapid learning.

- Time Constraints: Building a working prototype with UI, backend, and AI logic within hackathon time was challenging.


**Architecture Summary:**

1. User Interface: Collects symptoms and displays results.

2. Backend (Flask): Handles communication and state management.

3. Agent Layer: LLM-based reasoning that plans next follow-up questions.

4. Retriever Module: Searches verified medical documents for evidence.

5. Triage Engine: Combines AI insights + rule-based logic to give safe guidance.

6. Output Layer: Returns explanations, triage level, and medical sources.
