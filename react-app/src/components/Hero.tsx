import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface HeroProps {
  onSearch: (query: string) => void;
  searchQuery?: string;
}

const Hero: React.FC<HeroProps> = ({ onSearch, searchQuery: externalSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  
  // Update local search query when external search query changes
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Discover Your Next AI Solution</h1>
        <p className="hero-subtitle">
          The premier marketplace for cutting-edge Agentic and Generative AI tools. Find, integrate, and scale with ease.
        </p>
        <form className="hero-search-form" onSubmit={handleSearch} id="hero-search-form">
          <input
            ref={searchInputRef}
            type="text"
            className="hero-search-input"
            placeholder="Search by case, industry, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hero-search-button" aria-label="Search">
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
