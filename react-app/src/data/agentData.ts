import type { Agent, BusinessCapabilities } from '../types';
import { AgentService } from '../services/agentService';

// Define business capability levels
export const businessCapabilities: BusinessCapabilities = {
  "Development": {
    name: "Development",
    subCapabilities: ["SDLC", "Software Development / DevOps", "Software Engineering / Automated Program Repair", "Software Development / Project Management", "Software Development / Developer Tools"]
  },
  "Data": {
    name: "Data",
    subCapabilities: ["Data Analytics & Business Intelligence", "Data Labeling & Annotation", "Text-to-SQL & Business Intelligence", "Enterprise Knowledge Management"]
  },
  "Testing": {
    name: "Testing",
    subCapabilities: ["Testing", "ERP"]
  },
  "AI": {
    name: "AI",
    subCapabilities: ["Computer Vision / AI-assisted Development", "AI Safety & Security", "AI/LLM Observability & Monitoring", "Synthetic Data Generation"]
  },
  "Healthcare": {
    name: "Healthcare",
    subCapabilities: ["Healthcare", "Healthcare / Health Insurance"]
  },
  "Business Services": {
    name: "Business Services",
    subCapabilities: ["HR", "Legal", "Procurement", "Financial Services", "Property Management", "Retail / Content Marketing"]
  },
  "Customer Engagement": {
    name: "Customer Engagement",
    subCapabilities: ["Customer Service / E-commerce", "Telecommunications", "Sales Experience"]
  },
  "Supply Chain": {
    name: "Supply Chain",
    subCapabilities: ["Demand Forecast (SCM)"]
  },
  "Government": {
    name: "Government",
    subCapabilities: ["Government"]
  },
  "Cross-Domain": {
    name: "Cross-Domain",
    subCapabilities: ["Multiple Domains"]
  }
};

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
    return syncAgentData(agents);
  } catch (error) {
    console.error('Failed to fetch agents data:', error);
    return []; // Return empty array as fallback
  }
}
