import React from 'react';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i}>★</span>); // Full star
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i}>★</span>); // Half star (using full star for simplicity)
      } else {
        stars.push(<span key={i}>☆</span>); // Empty star
      }
    }
    
    return stars;
  };

  return (
    <div className="agent-card" onClick={() => onClick(agent)}>
      <div className="agent-header">
        <div className="agent-title">{agent.title}</div>
        <div className="agent-domain">{agent.domain}</div>
        {agent.subdomain && <div className="agent-subdomain">{agent.subdomain}</div>}
        <div className={`agent-trial ${agent.trial ? 'trial-available' : 'no-trial'}`}>
          {agent.trial ? 'Trial Available' : 'No Trial'}
        </div>
      </div>
      <div className="agent-body">
        <div className="agent-description">{agent.description}</div>
      </div>
      <div className="agent-footer">
        <div className="agent-rating">
          <div className="stars">
            {renderStars(agent.rating)}
          </div>
          <div>{agent.rating.toFixed(1)}</div>
        </div>
        <div className="agent-comments">{agent.comments} reviews</div>
      </div>
    </div>
  );
};

export default AgentCard;
