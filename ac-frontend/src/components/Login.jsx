import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import AuthContext from '../AuthContext';
import { login as loginService } from '../services/AuthService';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginService(username, password);
      login(token);
      toast.success('Login successful');

      // Decode the token to extract the role and doctorId
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const doctorId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']; // Assuming 'nameidentifier' is used for doctorId

      if (doctorId) {
        localStorage.setItem('doctorId', doctorId);
      }

      // Navigate based on the role
      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (role === 'Doctor') {
        navigate('/doctor-dashboard');
      } else if (role === 'Patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/dashboard'); // default fallback
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed: An unexpected error occurred');
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
