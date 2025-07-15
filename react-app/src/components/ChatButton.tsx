import React from 'react';
import { useChat } from '../hooks/useChatContext';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  const { state } = useChat();
  const { unreadCount } = state;
  
  return (
    <button 
      className="chat-button" 
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <span className="chat-icon">×</span>
      ) : (
        <>
          <span className="chat-icon">💬</span>
          {unreadCount > 0 && (
            <span className="unread-badge" aria-label={`${unreadCount} unread messages`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default ChatButton;
