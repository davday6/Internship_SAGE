import React, { useState } from 'react';
import type { Agent, Review } from '../types';

interface AgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (agentId: string, review: Review) => void;
}

const AgentModal: React.FC<AgentModalProps> = ({ agent, isOpen, onClose, onAddReview }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>('');

  if (!agent) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      alert('Please fill out all fields');
      return;
    }

    const newReview: Review = {
      author: name,
      date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      rating: rating,
      comment: comment
    };

    onAddReview(agent.id, newReview);
    setName('');
    setComment('');
    setRating(5);
  };

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
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{agent.title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="modal-domain-container">
            <span className="modal-domain">{agent.domain}</span>
            <span className="modal-subdomain">{agent.subdomain}</span>
            <span className={`modal-trial ${agent.trial ? 'trial-available' : 'no-trial'}`}>
              {agent.trial ? 'Trial Available' : 'No Trial Available'}
            </span>
          </div>
          
          <div className="modal-description">{agent.description}</div>
          
          {agent.trial && agent.trialUrl && (
            <a 
              href={agent.trialUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="trial-button"
            >
              Try {agent.title} Now
            </a>
          )}
          
          <div className="modal-section">
            <h3 className="modal-section-title">Reviews</h3>
            
            {agent.reviewsList && agent.reviewsList.length > 0 ? (
              agent.reviewsList.map((review, index) => (
                <div className="comment" key={index}>
                  <div className="comment-header">
                    <div className="comment-author">{review.author}</div>
                    <div className="comment-date">{formatDate(review.date)}</div>
                  </div>
                  <div className="stars">{renderStars(review.rating)}</div>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
            
            <h4 className="modal-section-title">Add Your Review</h4>
            <form className="comment-form" onSubmit={handleSubmitReview}>
              <div>
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="form-control"
                />
              </div>
              
              <div>
                <label htmlFor="rating">Rating</label>
                <div className="rating-input">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <React.Fragment key={star}>
                      <input 
                        type="radio" 
                        id={`star${star}`} 
                        name="rating" 
                        value={star} 
                        checked={rating === star}
                        onChange={() => setRating(star)}
                      />
                      <label htmlFor={`star${star}`}>★</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="comment">Comment</label>
                <textarea 
                  id="comment" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  required
                ></textarea>
              </div>
              
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
        <div className="modal-footer">
          <button className="contact-btn">Contact Specialist</button>
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
