import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';

interface HeaderProps {
  onOpenAuthModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout(localStorage.getItem('auth_token') || '');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      setIsUserMenuOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-text">
              <div className="logo-title" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>SAGE</div>
              <div className="logo-subtitle">Sogeti Agent Exchange</div>
            </div>
          </div>
          
          <div className="header-auth">
            {isAuthenticated ? (
              <div className="user-menu" ref={userMenuRef}>
                <button className="user-menu-trigger" onClick={toggleUserMenu}>
                  <span className="user-name">{user?.fullName || user?.username}</span>
                  <span className="user-menu-arrow">▼</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <div className="user-menu-name">{user?.fullName}</div>
                      <div className="user-menu-email">{user?.email}</div>
                    </div>
                    <div className="user-menu-divider"></div>
                    <button className="user-menu-item" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="auth-login-btn"
                onClick={onOpenAuthModal}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
