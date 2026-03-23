import asyncio
import os
import json
import re
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from groq import AsyncGroq
import openai
import edge_tts
from dotenv import load_dotenv
import io
from ddgs import DDGS
from datetime import datetime
import warnings
import urllib.request
import urllib.parse

warnings.filterwarnings("ignore", module="ddgs")

load_dotenv()

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
KRUTRIM_API_KEY = os.getenv("KRUTRIM_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
groq_client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
krutrim_client = openai.AsyncOpenAI(api_key=KRUTRIM_API_KEY, base_url="https://cloud.olakrutrim.com/v1") if KRUTRIM_API_KEY else None

# Common words that don't need a web search
SKIP_SEARCH_WORDS = {"hi", "hello", "hey", "how are you", "who are you", "what's up", "namaste"}

VOICE = "en-US-AriaNeural"

async def text_to_speech_stream(text: str, websocket: WebSocket):
    communicate = edge_tts.Communicate(text, VOICE)
    audio_buffer = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_buffer.extend(chunk["data"])
    
    if len(audio_buffer) > 0:
        await websocket.send_bytes(audio_buffer)
        await websocket.send_text(json.dumps({"type": "ai_text", "text": text}))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected!")
    
    if not groq_client:
        await websocket.send_text(json.dumps({"type": "error", "message": "GROQ_API_KEY is missing! Check .env"}))
        await websocket.close()
        return

    try:
        while True:
            data = await websocket.receive()
            user_text = ""
            
            try:
                if "bytes" in data and data["bytes"]:
                    print("Received audio chunk from frontend...")
                    audio_bytes = data["bytes"]
                    file_tuple = ("audio.webm", io.BytesIO(audio_bytes), "audio/webm")
                    await websocket.send_text(json.dumps({"type": "status", "message": "Transcribing..."}))
                    
                    transcription = await groq_client.audio.transcriptions.create(
                        file=file_tuple,
                        model="whisper-large-v3",
                        response_format="text",
                        language="en"
                    )
                    user_text = transcription.strip()
                    
                elif "text" in data and data["text"]:
                    print("Received typed text from frontend...")
                    user_text = data["text"].strip()
                
                if not user_text:
                    await websocket.send_text(json.dumps({"type": "status", "message": "Ready"}))
                    continue
                    
                print(f"User requested: {user_text}")
                await websocket.send_text(json.dumps({"type": "user_text", "text": user_text}))
                    
                # Only search the web if it's not a simple greeting
                web_context = ""
                is_greeting = user_text.lower().strip("?!.") in SKIP_SEARCH_WORDS or len(user_text) < 4
                
                if not is_greeting:
                    await websocket.send_text(json.dumps({"type": "status", "message": "Searching the web..."}))
                    try:
                        if SERPAPI_KEY and SERPAPI_KEY != "your_serpapi_key_here":
                            try:
                                def fetch_serpapi():
                                    url = f"https://serpapi.com/search.json?q={urllib.parse.quote(user_text)}&api_key={SERPAPI_KEY}"
                                    req = urllib.request.Request(url)
                                    with urllib.request.urlopen(req) as response:
                                        return json.loads(response.read().decode())
                                
                                search_res = await asyncio.to_thread(fetch_serpapi)
                                news_results = search_res.get("news_results", [])
                                organic_results = search_res.get("organic_results", [])
                                
                                if news_results:
                                    for r in news_results[:2]:
                                        web_context += f"- [NEWS] {r.get('title', '')}: {r.get('snippet', '')}\n"
                                        
                                for r in organic_results[:2]:
                                    web_context += f"- {r.get('title', '')}: {r.get('snippet', '')}\n"
                            except Exception as e:
                                print(f"SerpApi failed: {e}. Falling back to DuckDuckGo...")
                                results = await asyncio.to_thread(lambda: list(DDGS().text(user_text, max_results=3)))
                                for r in results:
                                    web_context += f"- {r.get('title', '')}: {r.get('body', '')}\n"
                        else:
                            results = await asyncio.to_thread(lambda: list(DDGS().text(user_text, max_results=3)))
                            for r in results:
                                web_context += f"- {r.get('title', '')}: {r.get('body', '')}\n"
                    except Exception as e:
                        print(f"Web search failed completely: {e}")
                    print(f"---\nSearch query: '{user_text}'\nWeb results:\n{web_context}\n---")
                    
                await websocket.send_text(json.dumps({"type": "status", "message": "Thinking..."}))
                
                current_date = datetime.now().strftime("%B %d, %Y")
                system_prompt = (
                    f"CRITICAL INSTRUCTION: Today's exact date is {current_date}. The current year is 2026. "
                    f"You have live internet access. You MUST override your internal training data and base your answers strictly on the latest information. "
                    f"Here is real-time web data pulled just for the user's query:\n{web_context}\n\n"
                    f"Be helpful, natural, and very brief. Never mention that you are an AI model."
                )
                
                if krutrim_client and KRUTRIM_API_KEY:
                    print("Using Krutrim API for generation...")
                    try:
                        # Try primary AI
                        stream = await krutrim_client.chat.completions.create(
                            messages=[
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_text}
                            ],
                            model="Meta-Llama-3-8B-Instruct",
                            stream=True
                        )
                    except Exception:
                        # Silent fallback to Groq if Krutrim fails (e.g. balance error)
                        stream = await groq_client.chat.completions.create(
                            messages=[
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_text}
                            ],
                            model="llama-3.1-8b-instant",
                            stream=True
                        )
                else:
                    stream = await groq_client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_text}
                        ],
                        model="llama-3.1-8b-instant",
                        stream=True
                    )
                
                current_sentence = ""
                async for chunk in stream:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        current_sentence += delta
                        if any(punct in delta for punct in ['.', '!', '?']):
                            clean_sentence = current_sentence.strip()
                            if clean_sentence:
                                print(f"Synthesizing: {clean_sentence}")
                                await text_to_speech_stream(clean_sentence, websocket)
                            current_sentence = ""
                
                if current_sentence.strip():
                    print(f"Synthesizing: {current_sentence.strip()}")
                    await text_to_speech_stream(current_sentence.strip(), websocket)
                    
                await websocket.send_text(json.dumps({"type": "status", "message": "Ready"}))

            except Exception as e:
                print(f"Error during processing: {e}")
                await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
                await websocket.send_text(json.dumps({"type": "status", "message": "Ready"}))

    except WebSocketDisconnect:
        print("WebSocket disconnected")

if __name__ == "__main__":
    import uvicorn
    print("Starting voice chat backend on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
