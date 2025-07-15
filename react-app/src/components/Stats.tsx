import React from 'react';
import type { Agent } from '../types';

interface StatsProps {
  agents: Agent[];
}

const Stats: React.FC<StatsProps> = ({ agents }) => {
  const totalAgents = agents.length;
  
  // Get unique domains
  const uniqueDomains = [...new Set(agents.map(agent => agent.domain))].length;
  
  // Calculate average rating
  const avgRating = agents.length > 0 
    ? (agents.reduce((acc, agent) => acc + agent.rating, 0) / agents.length).toFixed(1) 
    : "0.0";
  
  // Count total reviews
  const totalReviews = agents.reduce((acc, agent) => acc + agent.comments, 0);
  
  // Fixed number for capabilities (as in original HTML)
  const capabilityCount = 12;

  return (
    <div className="stats-container">
      <div className="stat-item stat-item-agents">
        <div className="stat-value" id="total-agents">{totalAgents}</div>
        <div className="stat-label">Agents</div>
      </div>
      <div className="stat-item stat-item-domains">
        <div className="stat-value" id="total-domains">{uniqueDomains}</div>
        <div className="stat-label">Domains</div>
      </div>
      <div className="stat-item stat-item-rating">
        <div className="stat-value" id="avg-rating">{avgRating}</div>
        <div className="stat-label">Avg Rating</div>
      </div>
      <div className="stat-item stat-item-reviews">
        <div className="stat-value" id="total-reviews">{totalReviews}</div>
        <div className="stat-label">Reviews</div>
      </div>
      <div className="stat-item stat-item-capabilities">
        <div className="stat-value" id="capability-count">{capabilityCount}</div>
        <div className="stat-label">Capabilities</div>
      </div>
    </div>
  );
};

export default Stats;
