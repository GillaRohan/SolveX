import React, { useState } from 'react';
import './AIChat.css';

export const AIChatButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(prev => !prev);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        className="ai-chat-button"
        aria-label="Open AI BIS Assistant"
      >
        🤖
      </button>
      {/* Popup */}
      {open && (
        <div className="ai-chat-popup" role="dialog" aria-modal="true">
          <div className="ai-chat-header">
            <h3>AI BIS Assistant</h3>
            <button onClick={toggle} className="close-btn" aria-label="Close">
              ✕
            </button>
          </div>
          <div className="ai-chat-body">
            {/* Placeholder for chat content */}
            <p className="placeholder-text">How can I help you with BIS standards today?</p>
          </div>
          <div className="ai-chat-input">
            <input type="text" placeholder="Ask a question..." disabled />
            <button disabled>Send</button>
          </div>
        </div>
      )}
    </>
  );
};
