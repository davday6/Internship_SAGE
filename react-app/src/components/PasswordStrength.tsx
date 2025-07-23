import React, { useState, useEffect } from 'react';

interface PasswordStrengthProps {
  password: string;
  onValidationChange: (isValid: boolean) => void;
}

interface PasswordRule {
  id: string;
  text: string;
  test: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    text: 'At least 8 characters long',
    test: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    text: 'Contains at least one uppercase letter',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    text: 'Contains at least one lowercase letter',
    test: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    text: 'Contains at least one number',
    test: (password) => /\d/.test(password)
  },
  {
    id: 'special',
    text: 'Contains at least one special character (!@#$%^&*)',
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
];

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, onValidationChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [validRules, setValidRules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newValidRules = new Set<string>();
    passwordRules.forEach(rule => {
      if (rule.test(password)) {
        newValidRules.add(rule.id);
      }
    });
    setValidRules(newValidRules);
    
    // Password is valid if all rules pass
    const isValid = passwordRules.every(rule => rule.test(password));
    onValidationChange(isValid);
  }, [password, onValidationChange]);

  const getStrengthLevel = () => {
    const passedRules = validRules.size;
    if (passedRules === 0) return { level: 'none', text: '', color: '#ccc' };
    if (passedRules <= 2) return { level: 'weak', text: 'Weak', color: '#ff4444' };
    if (passedRules <= 3) return { level: 'fair', text: 'Fair', color: '#ffaa00' };
    if (passedRules <= 4) return { level: 'good', text: 'Good', color: '#88cc00' };
    return { level: 'strong', text: 'Strong', color: '#00aa44' };
  };

  const strength = getStrengthLevel();

  return (
    <div className="password-strength-container">
      {password && (
        <div className="password-strength-indicator">
          <div className="strength-bar-container">
            <div 
              className={`strength-bar strength-${strength.level}`}
              style={{ 
                width: `${(validRules.size / passwordRules.length) * 100}%`,
                backgroundColor: strength.color
              }}
            />
          </div>
          {strength.text && (
            <span className="strength-text" style={{ color: strength.color }}>
              {strength.text}
            </span>
          )}
        </div>
      )}
      
      <div className="password-tooltip-wrapper">
        <button
          type="button"
          className="password-info-btn"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          ℹ️
        </button>
        
        {showTooltip && (
          <div className="password-tooltip">
            <div className="password-tooltip-header">Password Requirements:</div>
            <ul className="password-rules-list">
              {passwordRules.map(rule => (
                <li 
                  key={rule.id}
                  className={`password-rule ${validRules.has(rule.id) ? 'valid' : 'invalid'}`}
                >
                  <span className="rule-icon">
                    {validRules.has(rule.id) ? '✓' : '✗'}
                  </span>
                  {rule.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordStrength;
