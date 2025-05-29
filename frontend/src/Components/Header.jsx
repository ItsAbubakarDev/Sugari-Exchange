import React from 'react';
import './Header.css';

const Header = () => {
  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goToSignup = () => {
    window.location.href = '/SignUp';
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Sugar Exchange Logo" />
      </div>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="trade">Trade</a>
        <a href="coins">Market</a>
        <a href="portfolio">Portfolio</a>
      </nav>

      <div className="auth-buttons">
        <button className="login" onClick={goToLogin}>Login</button>
        <button className="signup" onClick={goToSignup}>Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
