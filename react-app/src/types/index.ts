export interface Agent {
  id: string;
  title: string;
  domain: string;
  subdomain: string;
  description: string;
  rating: number;
  comments: number;
  trial: boolean;
  reviewsList?: Review[];
}

export interface Review {
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface BusinessCapability {
  name: string;
  subCapabilities: string[];
}

export interface BusinessCapabilities {
  [key: string]: BusinessCapability;
}

export type FilterOptions = {
  l1Capability: string;
  l2Capability: string;
  trial: string;
  rating: string;
  sortBy: string;
};

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
  metadata?: {
    // For future implementation - can store AI model info, confidence scores, etc.
    model?: string;
    context?: string[];
    confidenceScore?: number;
    suggestedAgents?: string[];
    // Any other metadata that might be useful for chatbot integration
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  unreadCount: number;
}

export interface ChatContextProps {
  state: ChatState;
  sendMessage: (text: string) => Promise<void>;
  toggleChat: () => void;
  resetChat: () => void;
}
