import React, { useState, useEffect } from 'react';
import type { Agent, Review } from '../types';
import closeIcon from '../assets/close-icon.svg';
import bookIcon from '../assets/book-icon.svg';
import { useAuth } from '../contexts/AuthContext';

interface AgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (agentId: string, review: Review) => Promise<void>;
  onOpenAuthModal?: () => void;
}

const AgentModal: React.FC<AgentModalProps> = ({ agent, isOpen, onClose, onAddReview, onOpenAuthModal }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment('');
      setName('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!agent) return null;

  const formatDate = (date: string) => {
    // Create date with explicit timezone handling to prevent date shifting
    const [year, month, day] = date.split('-').map(num => parseInt(num));
    const dateObj = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim() || rating === 0) {
      alert('Please fill out all fields and select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      // Only send rating and comment to the API - author and date are handled by the backend
      await onAddReview(agent.id, {
        rating: rating,
        comment: comment
      } as Review);
      
      // Reset form on successful submission
      setName('');
      setComment('');
      setRating(0);
      
      // You could add a success message here if desired
      // alert('Review submitted successfully!');
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <button className="modal-close" onClick={onClose}>
            <img src={closeIcon} alt="Close" className="close-icon" />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-domain-container">
            {/* Display domains */}
            <div className="modal-domains">
              {(agent.domains || []).map((domain, index) => (
                <span key={index} className="modal-domain">{domain}</span>
              ))}
            </div>
            {/* Display subdomains */}
            <div className="modal-subdomains">
              {(agent.subdomains || []).map((subdomain, index) => (
                <span key={index} className="modal-subdomain">{subdomain}</span>
              ))}
            </div>
            <span className={`modal-trial ${agent.trialUrl ? 'trial-available' : 'no-trial'}`}>
              {agent.trialUrl ? 'Trial Available' : 'No Trial Available'}
            </span>
          </div>
          
          <div className="modal-description">{agent.description}</div>
          
          <div className="modal-actions">
            {agent.trialUrl && (
              <a 
                href={agent.trialUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="trial-button"
                onClick={(e) => {
                  // Prevent the click from closing the modal
                  e.stopPropagation();
                  // Open in new tab using JavaScript to ensure it works
                  window.open(agent.trialUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                Try {agent.title} Now
              </a>
            )}
            
            <a 
              href={agent.documentationUrl || '#'} 
              target={agent.documentationUrl ? '_blank' : '_self'} 
              rel="noopener noreferrer" 
              className={`documentation-button ${!agent.documentationUrl ? 'disabled' : ''} ${agent.trialUrl ? 'with-trial' : 'without-trial'}`}
              onClick={(e) => {
                if (!agent.documentationUrl) {
                  e.preventDefault();
                  return;
                }
                // Prevent the click from closing the modal
                e.stopPropagation();
                // Open in new tab using JavaScript to ensure it works
                window.open(agent.documentationUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <img src={bookIcon} alt="Documentation" className="book-icon" />
            </a>
          </div>
          
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
            {isAuthenticated ? (
              <form className="comment-form" onSubmit={handleSubmitReview}>
                <div className="name-container">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="name-input"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="rating-container">
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
                          disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="auth-required-message">
                <p>You must be signed in to submit a review.</p>
                <p>Please{' '}
                  <button 
                    className="auth-link-button" 
                    onClick={onOpenAuthModal}
                    type="button"
                  >
                    sign in
                  </button>{' '}
                  or{' '}
                  <button 
                    className="auth-link-button" 
                    onClick={onOpenAuthModal}
                    type="button"
                  >
                    create an account
                  </button>{' '}
                  to share your thoughts about this agent.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          {agent.commentUrl ? (
            <a 
              href={agent.commentUrl.includes('@') ? `mailto:${agent.commentUrl}` : agent.commentUrl} 
              target={agent.commentUrl.includes('@') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="contact-btn"
              onClick={(e) => {
                // Prevent the click from closing the modal
                e.stopPropagation();
                // For email addresses, use mailto: protocol
                if (agent.commentUrl?.includes('@') && !agent.commentUrl.startsWith('http')) {
                  // This is an email address
                  e.preventDefault();
                  window.location.href = `mailto:${agent.commentUrl}`;
                } else {
                  // This is a URL, open in new tab
                  e.preventDefault();
                  window.open(agent.commentUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {agent.commentUrl.includes('@') && !agent.commentUrl.startsWith('http') ? 'Email Developer' : 'Contact Developer'}
            </a>
          ) : (
            <button className="contact-btn" disabled>Contact Developer</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
