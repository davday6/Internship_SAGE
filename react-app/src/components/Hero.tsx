import React from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Discover Your Next AI Solution</h1>
        <p className="hero-subtitle">
          The premier marketplace for cutting-edge Agentic and Generative AI tools. Find, integrate, and scale with ease.
        </p>
        <form className="hero-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search by case, industry, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hero-search-button">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
