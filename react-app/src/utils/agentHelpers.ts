import type { Agent, Review } from '../types';
import { syncAgentComments } from '../data/agentData';

/**
 * Helper function to add a new agent to the application
 * 
 * @param agent The agent data to add (can be partial, with sensible defaults applied)
 * @param currentAgents The current list of agents
 * @returns A new array of agents with the new agent added
 */
export function addNewAgent(
  agent: Partial<Agent> & { title: string; domain: string }, 
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
    rating: agent.rating || 0,
    comments: agent.reviewsList ? agent.reviewsList.length : 0,
    trial: agent.trial !== undefined ? agent.trial : false,
    reviewsList: agent.reviewsList || []
  };
  
  // Return new array with the agent added
  return syncAgentComments([...currentAgents, newAgent]);
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
  return currentAgents.map(agent => {
    if (agent.id === agentId) {
      const reviewsList = agent.reviewsList ? [...agent.reviewsList, review] : [review];
      const newRating = reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length;
      
      return {
        ...agent,
        reviewsList,
        comments: reviewsList.length,
        rating: newRating
      };
    }
    return agent;
  });
}
