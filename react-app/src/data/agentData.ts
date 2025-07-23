import type { Agent, BusinessCapabilities } from '../types';
import { AgentService } from '../services/agentService';

// Function to derive business capabilities from agent data
export function deriveBusinessCapabilities(agents: Agent[]): BusinessCapabilities {
  const capabilities: BusinessCapabilities = {};
  
  agents.forEach(agent => {
    // Use the new array format
    const domains = agent.domains || [];
    const subdomains = agent.subdomains || [];
    
    domains.forEach(domain => {
      if (!domain) return;
      
      if (!capabilities[domain]) {
        capabilities[domain] = {
          name: domain,
          subCapabilities: []
        };
      }
      
      // Add all subdomains for this domain
      subdomains.forEach(subdomain => {
        if (subdomain && !capabilities[domain].subCapabilities.includes(subdomain)) {
          capabilities[domain].subCapabilities.push(subdomain);
        }
      });
    });
  });
  
  // Sort subcapabilities for consistent ordering
  Object.values(capabilities).forEach(capability => {
    capability.subCapabilities.sort();
  });
  
  return capabilities;
}

// Synchronize comments count and calculate average ratings from reviews
export function syncAgentData(agents: Agent[]): Agent[] {
  return agents.map(agent => {
    // Calculate the actual average rating from reviews
    const reviewsList = agent.reviewsList || [];
    const reviewCount = reviewsList.length;
    
    // Calculate average rating if reviews exist
    let averageRating = 0;
    if (reviewCount > 0) {
      const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
      averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
    }
    
    return {
      ...agent,
      comments: reviewCount,
      rating: averageRating
    };
  });
}

// Function to fetch and sync agent data from API
export async function fetchAgentsData(): Promise<Agent[]> {
  try {
    const agents = await AgentService.fetchAgents();
    const syncedAgents = syncAgentData(agents);
    
    return syncedAgents;
  } catch (error) {
    console.error('Failed to fetch agents data:', error);
    return []; // Return empty array as fallback
  }
}
