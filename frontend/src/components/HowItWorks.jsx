import React from 'react';

export default function HowItWorks({ onBack }) {
  return (
    <div className="chat-history" style={{ 
      display: 'block', 
      padding: '24px', 
      overflowY: 'auto',
      scrollbarWidth: 'thin'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: '#0f172a', 
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            How It Works
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
            Master your Voice AI assistant and explore its powerful features.
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '24px', 
          padding: '24px', 
          border: '1px solid rgba(0,0,0,0.04)' 
        }}>
          <h3 style={{ 
            fontSize: '17px', 
            fontWeight: '700', 
            color: '#4f46e5', 
            margin: '0 0 20px 0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            🎙️ Using the Voice Engine
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '15px'
              }}>1</div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Hold to Talk</strong>
                <span style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', display: 'block' }}>Press and hold the microphone button at the bottom. Keep holding while you speak natively.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '12px', background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '15px'
              }}>2</div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Release to Send</strong>
                <span style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', display: 'block' }}>Let go of the microphone. The AI's response will begin playing in milliseconds.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '15px'
              }}>3</div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Instant Interrupt</strong>
                <span style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', display: 'block' }}>If you want to stop the AI mid-sentence, just press the microphone again to take over instantly.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '15px'
              }}>4</div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Edit Messages</strong>
                <span style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', display: 'block' }}>Made a typo or said something wrong? Click the edit icon next to your sent message to change it.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '24px', 
          padding: '24px', 
          border: '1px solid rgba(0,0,0,0.04)' 
        }}>
          <h3 style={{ 
            fontSize: '17px', 
            fontWeight: '700', 
            color: '#8b5cf6', 
            margin: '0 0 20px 0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            ✨ Key Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            
            <div style={{ 
              background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>⚡</div>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>Ultra-Fast</strong>
              <span style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>Powered by Groq LPU</span>
            </div>

            <div style={{ 
              background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🌐</div>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>Web Search</strong>
              <span style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>Real-time live data</span>
            </div>

            <div style={{ 
              background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🗣️</div>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>Fluid Voice</strong>
              <span style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>Natural human TTS</span>
            </div>

            <div style={{ 
              background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>⌨️</div>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>Text Support</strong>
              <span style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>Type when quiet needed</span>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onBack}
          className="auth-btn"
          style={{ width: '100%', padding: '18px', marginTop: '8px', fontSize: '16px' }}
        >
          Start Chatting
        </button>

      </div>
    </div>
  );
}
