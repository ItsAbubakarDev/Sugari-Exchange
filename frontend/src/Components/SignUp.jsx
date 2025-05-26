import { useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);

  const navigate = useNavigate();

  const checkUsernameUnique = async (username) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/check-username', { username });
      setUsernameExists(response.data.exists);
    } catch (err) {
      console.error('Error checking username uniqueness:', err);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length > 2) {
      checkUsernameUnique(value);
    } else {
      setUsernameExists(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usernameExists) {
      alert('Username already taken. Please choose another one.');
      return;
    }

    axios
      .post('http://localhost:3001/api/users/register', {
        fullName: name,
        username,
        email,
        phone,
        password,
      })
      .then((result) => {
        console.log(result);
        navigate('/login');
      })
      .catch((err) => console.log(err));

    alert('Form submitted (mock)');
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="Signup-Heading">Sign Up</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        {usernameExists && (
          <p className="error">Username already exists. Choose another.</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="[0-9]{11}"
          title="Phone number must be 11 digits"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$"
          title="Must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
          required
        />

        <button type="submit">Register</button>

        <div className="links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
