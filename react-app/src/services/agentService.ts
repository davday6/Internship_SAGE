import type { Agent, Review } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class AgentService {
  static async fetchAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const agents: Agent[] = await response.json();
      return agents;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  static async submitReview(agentId: string, review: Omit<Review, 'date'>): Promise<Agent> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.agent;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactService {
  static async submitContactForm(formData: ContactFormData): Promise<{ message: string; id: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
}
