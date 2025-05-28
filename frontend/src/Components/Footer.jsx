import React from 'react';
import { Instagram, Twitter, Linkedin, Github, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <img src="/logo.png" alt="Company Logo" className="footer-logo" />
            <p className="footer-description">
              Advanced trading platform for modern investors. Trade smarter with real-time analytics and professional tools.
            </p>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="section-title">Contact</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@sugarexchange.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4 className="section-title">Follow Us</h4>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 SugarExchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;