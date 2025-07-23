import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sogeti-footer">
      <div className="footer-container">
        {/* Main Footer Content - Column Layout */}
        <div className="footer-main">
          {/* Left Column - Sogeti and Capgemini Section */}
          <div className="footer-column footer-brand-column">
            <div className="footer-logo-section">
              <a href="https://www.sogeti.com/" target="_blank" rel="noopener noreferrer" className="sogeti-logo-link">
                <img 
                  src="/sogeti-logo.webp" 
                  alt="Sogeti"
                  className="sogeti-logo"
                />
              </a>
            </div>
            
            <div className="capgemini-section">
              <div className="footer-subsection">
                <span className="footer-subsection-title">Explore Capgemini</span>
                <div className="capgemini-links">
                  <a href="https://www.capgemini.com/" target="_blank" rel="noopener noreferrer" className="capgemini-link">
                    <img 
                      src="/capgemini-logo.webp" 
                      alt="Capgemini"
                      className="capgemini-brand-logo"
                    />
                  </a>
                  <a href="https://www.capgemini.com/about-us/who-we-are/our-brands/capgemini-engineering/" target="_blank" rel="noopener noreferrer" className="capgemini-link">
                    <img 
                      src="/capgemini-engineering.webp" 
                      alt="Capgemini Engineering"
                      className="capgemini-brand-logo"
                    />
                  </a>
                  <a href="https://www.capgemini.com/about-us/who-we-are/our-brands/capgemini-invent/" target="_blank" rel="noopener noreferrer" className="capgemini-link">
                    <img 
                      src="/capgemini-invent.webp" 
                      alt="Capgemini Invent"
                      className="capgemini-brand-logo"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Navigation */}
          <div className="footer-column footer-nav-column">
            <ul className="footer-links main-nav">
              <li><a href="https://www.sogeti.com/services/" target="_blank" rel="noopener noreferrer">Services</a></li>
              <li><a href="https://www.sogeti.com/client-stories/" target="_blank" rel="noopener noreferrer">Client stories</a></li>
              <li><a href="https://www.sogeti.com/insights/" target="_blank" rel="noopener noreferrer">Insights</a></li>
              <li><a href="https://www.sogeti.com/careers/" target="_blank" rel="noopener noreferrer">Careers</a></li>
              <li><a href="https://www.sogeti.com/about-us/" target="_blank" rel="noopener noreferrer">About us</a></li>
              <li><a href="https://www.sogeti.com/contact-us/" target="_blank" rel="noopener noreferrer">Contact us</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          {/* Legal Links */}
          <div className="footer-legal">
            <ul className="footer-links legal-links">
              <li><a href="https://www.sogeti.com/accessibility/" target="_blank" rel="noopener noreferrer">Accessibility</a></li>
              <li><a href="https://www.sogeti.com/cookie-policy/" target="_blank" rel="noopener noreferrer">Cookie policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Cookie settings</a></li>
              <li><a href="https://www.sogeti.com/privacy-notice/" target="_blank" rel="noopener noreferrer">Privacy notice</a></li>
              <li><a href="https://www.sogeti.com/terms-of-use/" target="_blank" rel="noopener noreferrer">Terms of use</a></li>
            </ul>
          </div>

          {/* Copyright and Social */}
          <div className="footer-info">
            <div className="footer-copyright">
              © {currentYear} Sogeti. All rights reserved.
            </div>
            
            <div className="footer-social">
              <a 
                href="https://www.linkedin.com/company/sogeti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Sogeti LinkedIn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@SogetiWorldwide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Sogeti YouTube"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
