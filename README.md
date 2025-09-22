<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>🎭 Multi-Emotion Chatbot with Gemini + Gradio</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #fafafa;
      color: #333;
    }
    h1, h2, h3 {
      color: #222;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.95em;
    }
    pre {
      background: #272822;
      color: #f8f8f2;
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
    }
    ul {
      margin-left: 20px;
    }
    .emoji {
      font-size: 1.2em;
    }
    .license {
      margin-top: 30px;
      font-size: 0.9em;
      color: #777;
    }
  </style>
</head>
<body>
  <h1>🎭 Multi-Emotion Chatbot with Gemini + Gradio</h1>
  <p>
    This project is an <strong>AI-powered chatbot</strong> where five emotions—
    <strong>Joy, Sadness, Fear, Disgust, and Anger</strong>—respond to the user in a
    group-chat style. Built with <strong>Google Gemini API</strong> and
    <strong>Gradio</strong>, it creates an engaging and interactive demo of
    multi-agent conversations.
  </p>

  <h2>🚀 Features</h2>
  <ul>
    <li>🤖 <strong>Multi-Agent Chat</strong> – Five emotions reply together, each with a unique voice.</li>
    <li>⚡ <strong>Fast Responses (~3–5s)</strong> – Optimized prompts for speed by avoiding JSON-heavy parsing.</li>
    <li>🖥 <strong>Interactive UI</strong> – Simple and clean Gradio interface.</li>
    <li>📜 <strong>Conversation Memory</strong> – Keeps track of chat history.</li>
  </ul>

  <h2>🛠 Installation</h2>
  <ol>
    <li><strong>Clone the repository</strong>
      <pre><code>git clone https://github.com/your-username/emotion-chatbot.git
cd emotion-chatbot</code></pre>
    </li>
    <li><strong>Create a virtual environment (optional)</strong>
      <pre><code>python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate</code></pre>
    </li>
    <li><strong>Install dependencies</strong>
      <pre><code>pip install -r requirements.txt</code></pre>
    </li>
    <li><strong>Set up your Gemini API Key</strong>  
      Get an API key from <a href="https://aistudio.google.com/" target="_blank">Google AI Studio</a> and export it:
      <pre><code># Linux / macOS
export GEMINI_API_KEY="your_api_key_here"

# Windows
setx GEMINI_API_KEY "your_api_key_here"</code></pre>
    </li>
  </ol>

  <h2>▶️ Usage</h2>
  <p>Run the chatbot with:</p>
  <pre><code>python app.py</code></pre>
  <p>Then open <code>http://127.0.0.1:7860</code> in your browser.</p>

  <h2>📌 Example Conversation</h2>
  <p><strong>You:</strong> I have an exam tomorrow.</p>
  <p><strong>Bot:</strong></p>
  <ul>
    <li><strong>Joy:</strong> You got this, just think of how great it’ll feel when it’s done!</li>
    <li><strong>Sadness:</strong> Exams can be stressful, I feel your worries.</li>
    <li><strong>Fear:</strong> What if you forget something? Better revise key points.</li>
    <li><strong>Disgust:</strong> Ugh, exams are such a drag.</li>
    <li><strong>Anger:</strong> Why do they make us suffer with these tests?!</li>
  </ul>

  <div class="license">
    <h2>📜 License</h2>
    <p>MIT License</p>
  </div>
</body>
</html>
