import React from 'react';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-text">
            <div className="logo-title" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>SAGE</div>
            <div className="logo-subtitle">Sogeti Agent Exchange</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
