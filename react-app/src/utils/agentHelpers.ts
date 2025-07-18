import type { Agent, Review } from '../types';
import { syncAgentData } from '../data/agentData';

/**
 * Helper function to add a new agent to the application
 * 
 * @param agent The agent data to add (can be partial, with sensible defaults applied)
 * @param currentAgents The current list of agents
 * @returns A new array of agents with the new agent added
 */
export function addNewAgent(
  agent: Partial<Agent> & { title: string; domain: string; trialUrl?: string }, 
  currentAgents: Agent[]
): Agent[] {
  // Generate a unique ID
  const newId = (Math.max(...currentAgents.map(a => parseInt(a.id))) + 1).toString();
  
  // Create a new agent with defaults
  const newAgent: Agent = {
    id: newId,
    title: agent.title,
    domain: agent.domain,
    subdomain: agent.subdomain || agent.domain,
    description: agent.description || `Description for ${agent.title}`,
    trialUrl: agent.trialUrl, // Include trial URL if provided
    reviewsList: agent.reviewsList || []
  };
  
  // Return new array with the agent added
  return syncAgentData([...currentAgents, newAgent]);
}

/**
 * Helper function to add a review to an agent
 * 
 * @param agentId The ID of the agent to add the review to
 * @param review The review to add
 * @param currentAgents The current list of agents
 * @returns A new array of agents with the review added
 */
export function addReviewToAgent(
  agentId: string,
  review: Review,
  currentAgents: Agent[]
): Agent[] {
  // First update the agent's reviewsList
  const updatedAgents = currentAgents.map(agent => {
    if (agent.id === agentId) {
      const reviewsList = agent.reviewsList ? [...agent.reviewsList, review] : [review];
      return {
        ...agent,
        reviewsList
      };
    }
    return agent;
  });
  
  // Then use syncAgentData to recalculate ratings and comments counts
  return syncAgentData(updatedAgents);
}
