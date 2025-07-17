import React, { createContext, useContext, useReducer } from 'react';
import type { ChatMessage, ChatState, ChatContextProps } from '../types';

const backendUrl = process.env.REACT_APP_BACKEND_URL

// Initial chat state
const initialState: ChatState = {
  messages: [
    {
      id: '1',
      text: 'Hi there! How can I help you with our AI solutions?',
      sender: 'bot',
      timestamp: new Date()
    }
  ],
  isOpen: false,
  isTyping: false,
  unreadCount: 0
};

// Action types
type ChatAction = 
  | { type: 'TOGGLE_CHAT' }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_TYPING'; isTyping: boolean }
  | { type: 'RESET_CHAT' }
  | { type: 'READ_MESSAGES' };

// Reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isOpen: !state.isOpen,
        unreadCount: 0, // Reset unread count when opening
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        unreadCount: !state.isOpen && action.message.sender === 'bot' 
          ? state.unreadCount + 1 
          : state.unreadCount
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.isTyping
      };
    case 'RESET_CHAT':
      return {
        ...initialState,
        isOpen: state.isOpen // Keep current open state
      };
    case 'READ_MESSAGES':
      return {
        ...state,
        unreadCount: 0
      };
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Chat provider component
export const ChatProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Send message function - to be connected to real chatbot service in the future
  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    dispatch({ type: 'ADD_MESSAGE', message: userMessage });
    
    // Set bot to typing
    dispatch({ type: 'SET_TYPING', isTyping: true });
    
    try {
      // Placeholder for future chatbot integration
      // This is where you would make API calls to your AI service
      
      // Simulate a delay for now
      // await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userMessage })
      });

      const data = await response.json();
      
      // Example response (replace with real API call)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        status: 'sent'
      };
      
      dispatch({ type: 'ADD_MESSAGE', message: botMessage });
    } catch (error) {
      // Handle error
      console.error('Failed to get bot response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        status: 'failed'
      };
      
      dispatch({ type: 'ADD_MESSAGE', message: errorMessage });
    } finally {
      dispatch({ type: 'SET_TYPING', isTyping: false });
    }
  };

  // Toggle chat function
  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
    if (!state.isOpen) {
      dispatch({ type: 'READ_MESSAGES' });
    }
  };

  // Reset chat function
  const resetChat = () => {
    dispatch({ type: 'RESET_CHAT' });
  };

  // Context value
  const value: ChatContextProps = {
    state,
    sendMessage,
    toggleChat,
    resetChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use chat context
export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
