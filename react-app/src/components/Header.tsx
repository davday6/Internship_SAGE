import React from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-text">
            <span className="logo-title">SAGE</span>
            <span>Sogeti Agent Exchange</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
