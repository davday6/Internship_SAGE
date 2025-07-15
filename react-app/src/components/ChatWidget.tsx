import React from 'react';
import ChatButton from './ChatButton';
import ChatInterface from './ChatInterface';
import { ChatProvider, useChat } from '../hooks/useChatContext';

const ChatWidgetInner: React.FC = () => {
  const { state, toggleChat } = useChat();

  return (
    <div className="chat-widget">
      {state.isOpen && <ChatInterface />}
      <ChatButton onClick={toggleChat} isOpen={state.isOpen} />
    </div>
  );
};

// Wrap with provider to make context available
const ChatWidget: React.FC = () => {
  return (
    <ChatProvider>
      <ChatWidgetInner />
    </ChatProvider>
  );
};

export default ChatWidget;
