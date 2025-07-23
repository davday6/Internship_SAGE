import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import PasswordStrength from './PasswordStrength';
import type { LoginCredentials, RegisterData } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  
  const { login } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState<LoginCredentials>({
    login: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });

  const resetForm = () => {
    setLoginData({ login: '', password: '' });
    setRegisterData({ username: '', email: '', password: '', fullName: '' });
    setError(null);
    setSuccess(null);
    setIsSubmitting(false);
    setIsPasswordValid(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTabSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError(null);
    setSuccess(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await AuthService.login(loginData);
      login(response.token, response.user);
      setSuccess('Login successful!');
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password validation before submitting
    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await AuthService.register(registerData);
      login(response.token, response.user);
      setSuccess('Registration successful!');
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-modal-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => handleTabSwitch(true)}
              disabled={isSubmitting}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => handleTabSwitch(false)}
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </div>
          <button className="auth-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="auth-modal-body">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="login">Username or Email</label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={loginData.login}
                  onChange={handleLoginChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your username or email"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                />
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Choose a username"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your email"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="registerPassword">Password</label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Choose a strong password"
                />
                <PasswordStrength 
                  password={registerData.password}
                  onValidationChange={setIsPasswordValid}
                />
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={isSubmitting || (!isPasswordValid && registerData.password.length > 0)}
              >
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
