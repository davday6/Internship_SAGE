import React from 'react';
import { useChat } from '../hooks/useChatContext';
import chatBubbleIcon from '../assets/chat-bubble.svg';
import closeIcon from '../assets/close-icon.svg';

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
        <img src={closeIcon} alt="Close chat" className="chat-icon" />
      ) : (
        <>
          <img src={chatBubbleIcon} alt="Open chat" className="chat-icon" />
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
