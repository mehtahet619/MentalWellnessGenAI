# 🎭 Multi-Emotion Chatbot with Gemini + Gradio

An AI-powered chatbot where five emotions — **Joy, Sadness, Fear, Disgust, and Anger** — respond to the user in a group-chat style.  
Built with **Google Gemini API** and **Gradio**, it creates an engaging and interactive multi-agent conversation experience.

---

## 🚀 Features
- 🤖 **Multi-Agent Chat** – Five emotions reply together, each with a unique voice.
- ⚡ **Fast Responses (~3–5s)** – Optimized prompts for speed by avoiding JSON-heavy parsing.
- 🖥 **Interactive UI** – Simple and clean Gradio interface.
- 📜 **Conversation Memory** – Maintains context from previous messages.
- 🎯 **Subconscious Summary** – Optional final summary from “Subconscious Mind” synthesizing all emotions.

---

## 🛠 Tech Stack
- **Frontend:** Gradio
- **Backend:** Python
- **AI Model:** Google Gemini API
- **Libraries:** `gradio`, `google-generativeai`, `os`, `threading`

---

## 📂 Project Structure
emotion-chatbot/
│── index.html # Main chatbot application
│── requirements.txt # Python dependencies
│── README.md # Project documentation
│── LICENSE # MIT License



---

## ⚡ Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/emotion-chatbot.git
cd emotion-chatbot
```
2. **Create a virtual environment (optional but recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up your Gemini API Key**
   ```bash
   # Linux / macOSexport
   GEMINI_API_KEY="your_api_key_here"
   # Windows
   setx GEMINI_API_KEY "your_api_key_here"
    ```
**Example Conversation**

You: I have an exam tomorrow.
Bot:
Joy: You got this, just think of how great it’ll feel when it’s done!
Sadness: Exams can be stressful, I feel your worries.
Fear: What if you forget something? Better revise key points.
Disgust: Ugh, exams are such a drag.
Anger: Why do they make us suffer with these tests?!

# Future Improvements

-Multi-language support for international users.
-Voice input/output for a more immersive experience.
-Cloud deployment with persistent chat history.
-Lightweight model integration for even faster responses.

# License

This project is licensed under the MIT [LICENSE](LICENSE) License.
