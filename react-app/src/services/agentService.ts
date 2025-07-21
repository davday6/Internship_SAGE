import type { Agent } from '../types';

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
}
