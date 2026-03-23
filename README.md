# 🎙️ Next-Gen Voice Chatbot AI 

A highly-responsive, real-time Voice AI Assistant built with React, FastAPI, Groq LPU, and WebSockets. Experience a fluid, native voice-conversation platform equipped with zero-latency streaming answers, live web-search integration, and Firebase Authentication inside a stunningly premium glassmorphic UI.

---

## ✨ Key Features
- **Ultra-Fast AI Engine**: Native integration with [Groq's LPU inference system](https://groq.com/) for lightning-fast Llama-3 8B text generation.
- **Fluid Voice Responses**: Powered by Azure's Edge TTS technology, streamed continuously back to the frontend in chunks for absolutely zero wait-time between thought and spoken word.
- **Real-Time Web Search**: Features live search through DuckDuckGo (and Google SerpApi), fully integrated to synthesize answers with live data.
- **Bi-Directional Communication**: Talk using your microphone or type out your prompts entirely. AI transcription is flawlessly powered by Whisper-large-v3.
- **Beautiful Glassmorphism UI**: High-end user interface with slick Framer Motion animations, deeply integrated CSS styling, editing capabilities, and hover states.
- **Firebase Authentication**: Robust user access with Email/Password generation and 1-Click "Sign in with Google" authentication logic.

---

## 🛠️ Architecture Stack
**Frontend Ecosystem**
- React.js + Vite
- Framer Motion (Animations and Presence)
- Lucide React Icons
- Firebase Auth

**Backend Engine**
- Python 3.x
- FastAPI & Uvicorn (WebSocket Core)
- AsyncGroq / OpenAI Python clients
- `edge_tts`
- `ddgs` (DuckDuckGo Live Search Async)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and standard `npm`
- Python 3.10+
- A Google Firebase Project (for client keys)
- Groq API Key

### Backend Setup (Python API Services)
1. **Navigate to the Backend Directory**
   ```bash
   cd backend
   ```
2. **Setup Virtual Environment & Install Modules**
   ```bash
   python -m venv venv
   # Activate it:
   # Windows: venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```
   *(Ensure you have fastapi, uvicorn, groq, openai, edge_tts, ddgs installed)*
   
3. **Configure Environment Keys**
   Open or create an `.env` file in the backend directory:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   KRUTRIM_API_KEY=your_krutrim_api_key_here # Optional Fallback
   SERPAPI_KEY=your_serpapi_key_here         # Optional Fallback
   ```
4. **Boot up the Engine!**
   ```bash
   python main.py
   # Or using uvicorn directly: uvicorn main:app --reload
   ```

### Frontend Setup (React UI)
1. **Navigate to the Client Directory**
   ```bash
   cd frontend
   ```
2. **Install Node Depedencies**
   ```bash
   npm install
   ```
3. **Configure Firebase Context**
   Add your initialization files in `src/firebase.js` mapping to your own Firebase Web configuration environment.
4. **Spin up the React interface**
   ```bash
   npm run dev
   ```

---

## 🎧 How It Works
1. **Hold to Talk**: Press and hold the microphone icon to seamlessly record your question.
2. **Release to Send**: As soon as you let go, your voice buffer is piped directly into Groq's Whisper API.
3. **The Web Search Check**: The application instantly accesses live Internet datastreams to fetch breaking news.
4. **LLM Fast-Stream**: Your aggregated context creates milliseconds turnaround speeds to answer your prompt.
5. **Listen!**: The Edge TTS natively outputs the audio byte array using the Web Audio API without missing a beat. 
   *(Alternatively, just furiously type at the keyboard instead of talking—we support that too!)*

---

### License
This is a personal open-source demonstration. Feel free to clone, edit, or utilize this pipeline as a boilerplate hook for your own real-time Voice AI applications!
