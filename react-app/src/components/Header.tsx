import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/sage-logo-020.png" alt="SAGE - Sogeti Agent Exchange" />
          Sogeti Agent Exchange
        </div>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search for agents..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button id="search-button" type="submit">🔍</button>
        </form>
      </div>
    </header>
  );
};

export default Header;
