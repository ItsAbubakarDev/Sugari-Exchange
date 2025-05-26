import { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
      
      if (response.data && response.data.accessToken) {
        alert(`Logging in as ${email}`);
        navigate('/dashboard');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="Login-Heading">Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div className="links">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <div className="links">
          <a href="/signup">Not registered? Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
