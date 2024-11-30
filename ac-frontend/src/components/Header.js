import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-dark text-white py-3">
      <nav className="container">
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">Home</Link>
          </li>
          {!auth ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link text-white">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link text-white">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link text-white">Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
