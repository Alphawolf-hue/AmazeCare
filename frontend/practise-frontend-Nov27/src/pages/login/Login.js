import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css'; // Import custom CSS
import AmazaLogo from "../../images/nav-logo-cropped.svg"
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const { token, role } = await login(username, password);
      localStorage.setItem('token', token); // Save JWT token

      // Redirect based on role
      if (role === 'Doctor') navigate('/doctor-dashboard');
      else if (role === 'Patient') navigate('/patient-dashboard');
      else if (role === 'Administrator') navigate('/admin-dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div className="d-flex w-100 justify-content-between">
            <div className="navbar-buttons">
              <a href="/" className="btn btn-outline-light me-2 fst-italic ">
                Home
              </a>
              <a href="/signup" className="btn btn-outline-light fst-italic">
                Signup
              </a>
            </div>
            <div className="navbar-logo mx-auto ">
    </div>
    <div className="navbar-logo mx-auto d-flex align-items-center">
      <img src={AmazaLogo} alt="Logo" className="logo" />
    </div>
            {/* <h1 className="navbar-brand mb-0 fst-italic">AmazeCare</h1> */}
          </div>
        </div>
      </nav>

      {/* Login Container */}
      <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
      <div className="svg-watermark"></div>
        <div className="login-container">
          <h2 className="text-dark login-heading mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="me-3">Username</label>
              <input
                type="text"
                value={username}
                className='fst-italic'
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="me-3">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <a href="/signup" className="signup-link mt-2 fst-italic">
            New user? Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
