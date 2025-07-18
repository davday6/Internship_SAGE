import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChatContext';

const ChatInterface: React.FC = () => {
  const { state, sendMessage } = useChat();
  const { messages, isTyping } = state;
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Send message using context
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>SAGE Assistant</h3>
        <p>Ask me about our AI solutions</p>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message bot-message typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          aria-label="Type your message"
        />
        <button type="submit" aria-label="Send message">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
