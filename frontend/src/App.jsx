import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { auth, googleProvider } from './firebase';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import HowItWorks from './components/HowItWorks';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState('chat');

  // Chat State
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("System Ready");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const chatEndRef = useRef(null);

  // 1. Firebase Auth Observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. WebSocket Connection (Only connect if user is logged in)
  useEffect(() => {
    if (user) {
      connectWebSocket();
    }
    return () => { if (wsRef.current) wsRef.current.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle committing text blocks
  useEffect(() => {
    if ((status.includes("Ready") || status.includes("Online")) && (userTranscript || aiResponse)) {
      setMessages(prev => [
        ...prev,
        ...(userTranscript ? [{ role: 'user', text: userTranscript }] : []),
        ...(aiResponse ? [{ role: 'ai', text: aiResponse }] : [])
      ]);
      setUserTranscript("");
      setAiResponse("");
    }
  }, [status, userTranscript, aiResponse]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, userTranscript, aiResponse, status]);

  // --- Auth Handlers ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // After creating user, attach the requested Display Name to their profile
        await updateProfile(userCred.user, { displayName: name });
        // Manually update local state to reflect the new displayName instantly
        setUser({ ...userCred.user, displayName: name });
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMessages([]);
    if (wsRef.current) wsRef.current.close();
  };

  // --- Chat Handlers ---
  const connectWebSocket = () => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws');
    wsRef.current.onopen = () => setStatus("Online");

    wsRef.current.onmessage = async (event) => {
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data);
        if (data.type === "status") setStatus(data.message);
        else if (data.type === "user_text") { setUserTranscript(data.text); setAiResponse(""); }
        else if (data.type === "ai_text") setAiResponse(prev => prev ? prev + " " + data.text : data.text);
      } else if (event.data instanceof Blob) {
        playAudioBlob(event.data);
      }
    };

    wsRef.current.onclose = () => {
      setStatus("Offline - Retrying...");
      setTimeout(connectWebSocket, 3000);
    };
  };

  const playAudioBlob = async (blob) => {
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
    audioQueueRef.current.push(audioBuffer);
    playNextInQueue();
  };

  const playNextInQueue = () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    isPlayingRef.current = true;
    const audioBuffer = audioQueueRef.current.shift();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => { isPlayingRef.current = false; playNextInQueue(); };
    source.start(0);
  };

  const stopPlayingAudio = () => { audioQueueRef.current = []; isPlayingRef.current = false; };

  const startRecording = async () => {
    try {
      stopPlayingAudio();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.send(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setStatus("Listening...");
    } catch (err) {
      console.error(err);
      setStatus("Mic Error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("Processing...");
    }
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    stopPlayingAudio();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.send(inputText);
    setInputText("");
  };

  const handleEditMessage = (idx, text) => {
    setMessages(prev => prev.slice(0, idx));
    setInputText(text);
  };

  const handleNewChat = () => {
    setMessages([]);
    stopPlayingAudio();
  };

  const isThinking = status.includes("Thinking") || status.includes("Searching") || status.includes("Transcribing");

  // --- Loading State ---
  if (authLoading) return <div className="app-wrapper"><div className="auth-header">Loading...</div></div>;

  // --- Auth UI View ---
  if (!user) {
    return (
      <div className="app-wrapper">
        <div className="auth-container">

          <div className="auth-hero-svg">
            {authMode === 'login' ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            )}
          </div>

          <div className="auth-header">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '400', marginTop: '8px', letterSpacing: 'normal' }}>
              {authMode === 'login' ? 'Please enter your details to sign in.' : 'Let\'s get you set up with a new account.'}
            </p>
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <form className="auth-form" onSubmit={handleAuth}>
            {authMode === 'signup' && (
              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required={authMode === 'signup'}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn">
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <button onClick={handleGoogleLogin} className="auth-btn auth-btn-google">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
            Sign in with Google
          </button>

          <div className="auth-switch">
            {authMode === 'login' ? (
              <>Don't have an account? <span onClick={() => setAuthMode('signup')}>Sign up</span></>
            ) : (
              <>Already have an account? <span onClick={() => setAuthMode('login')}>Login</span></>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Main Chat UI View ---
  return (
    <div className="app-wrapper">

      <div className="chat-container">

        {/* Sleek Integrated Header replacing the floating banner */}
        <div className="chat-header">
          <div className="user-profile">
            <div className="profile-avatar">{user.displayName ? user.displayName[0].toUpperCase() : 'U'}</div>
            <div className="profile-info">
              <span className="profile-name">{user.displayName || 'Guest User'}</span>
              <span className="chat-status" data-status={status}>{status}</span>
            </div>
          </div>
          <div className="header-actions">
            {/* Info Button */}
            <button className="header-btn" title="How It Works" onClick={() => setCurrentView(currentView === 'chat' ? 'info' : 'chat')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
            {/* New Chat Button */}
            <button className="header-btn" title="New Chat" onClick={handleNewChat}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            </button>
            {/* Logout Button */}
            <button className="header-btn delete" title="Logout" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            </button>
          </div>
        </div>

        {currentView === 'info' ? (
          <HowItWorks onBack={() => setCurrentView('chat')} />
        ) : (
          <>
            <div className="chat-history">
          {messages.length === 0 && !userTranscript && !aiResponse && (
            <>
              <div className="msg-row ai">
                <div className="avatar-box">🤖</div>
                <div className="bubble">Authentication complete. Welcome, {user.displayName || 'friend'}! What is your question?</div>
              </div>
            </>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`msg-row ${msg.role === 'user' ? 'user' : 'ai'}`}>

              {/* If it's a user message, show the edit action next to it */}
              {msg.role === 'user' && (
                <div className="msg-actions">
                  <button className="msg-action-btn" onClick={() => handleEditMessage(idx, msg.text)} title="Edit Message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                </div>
              )}

              {msg.role === 'ai' && <div className="avatar-box">🤖</div>}
              <div className="bubble">{msg.text}</div>
            </div>
          ))}

          {userTranscript && (
            <div className="msg-row user">
              <div className="bubble" style={{ opacity: 0.7 }}>{userTranscript}...</div>
              <div className="avatar-box">👤</div>
            </div>
          )}

          {aiResponse && (
            <div className="msg-row ai">
              <div className="avatar-box">🤖</div>
              <div className="bubble">{aiResponse}</div>
            </div>
          )}

          {isThinking && (
            <div className="typing-indicator">typing...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        <form className="chat-input-wrapper" onSubmit={handleSendText}>
          <input
            className="chat-input"
            placeholder="Type the message ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            title="Hold to speak"
            type="button"
            className={`icon-btn ${isRecording ? 'recording' : ''}`}
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerLeave={stopRecording}
          >
            <svg className="mic-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
          </button>

          <button type="submit" className="icon-btn" title="Send text">
            <svg className="send-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
