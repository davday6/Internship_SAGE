# Chat Widget Integration Guide

This document provides guidance for integrating a real chatbot into the SAGE chat widget.

## Architecture Overview

The chat widget consists of three main components:
1. **ChatWidget** - The main container component that provides the ChatContext
2. **ChatButton** - A floating button that opens/closes the chat interface
3. **ChatInterface** - The chat UI where messages are displayed and sent

## Chat Context

The ChatContext provides a centralized state management system for the chat. It includes:

- **Messages** - Array of chat messages
- **Chat UI State** - Open/closed state, typing indicator, unread count
- **Actions** - Send message, toggle chat, reset chat

## How to Integrate a Real Chatbot

### 1. Update the `sendMessage` function in `useChatContext.tsx`

The current implementation uses a placeholder response. Replace it with your chatbot API:

```typescript
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
    // INTEGRATION POINT: Replace with your chatbot API call
    const response = await yourChatbotAPI.sendMessage(text);
    
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent',
      metadata: {
        model: response.model,
        confidenceScore: response.confidence,
        // Add any other metadata from your chatbot
      }
    };
    
    dispatch({ type: 'ADD_MESSAGE', message: botMessage });
  } catch (error) {
    // Handle error
    console.error('Failed to get bot response:', error);
    dispatch({ 
      type: 'ADD_MESSAGE', 
      message: {
        id: Date.now().toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        status: 'failed'
      } 
    });
  } finally {
    dispatch({ type: 'SET_TYPING', isTyping: false });
  }
};
```

### 2. Add Authentication (if required)

If your chatbot API requires authentication, add it to the ChatContext:

```typescript
// Add to initialState
const initialState = {
  // existing state...
  auth: {
    isAuthenticated: false,
    userId: null,
    sessionId: null
  }
};

// Add authentication actions and state handling
```

### 3. Add Message History Persistence

To persist chat history between sessions:

```typescript
// In useChatContext.tsx
useEffect(() => {
  // Load stored messages from localStorage or your backend
  const storedMessages = localStorage.getItem('chatMessages');
  if (storedMessages) {
    const parsedMessages = JSON.parse(storedMessages);
    // Transform date strings back to Date objects
    const messages = parsedMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    dispatch({ type: 'SET_MESSAGES', messages });
  }
}, []);

// Add effect to save messages when they change
useEffect(() => {
  localStorage.setItem('chatMessages', JSON.stringify(state.messages));
}, [state.messages]);
```

### 4. Add Advanced Features

The ChatMessage type includes a metadata field that can be used for advanced features:

- **Suggested Agents** - Link to agents from the catalog
- **Confidence Scores** - Show how confident the AI is in its response
- **Context Tracking** - Keep track of conversation context

## Styling

The chat widget styling is defined in `App.css`. You can modify these styles to match your design requirements.

## Additional Customization

1. **Chat Button Position**: Modify the `.chat-widget` class in CSS
2. **Chat Interface Size**: Adjust the dimensions in the `.chat-interface` class
3. **Colors and Theming**: Update color variables to match your brand

## Troubleshooting

- **Unresponsive Chatbot**: Check network requests in browser dev tools
- **Missing Messages**: Verify state updates in the ChatContext
- **UI Issues**: Inspect CSS and component rendering

For further assistance, contact the development team.
