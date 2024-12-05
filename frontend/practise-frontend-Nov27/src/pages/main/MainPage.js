import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css';
import logo from "../../images/main-logo-cropped.svg"
import footerLogo from "../../images/footer.svg"

const MainPage = () => {
  return (
    <div className="main-page d-flex flex-column justify-content-between">
      {/* Navbar */}
      <div className="svg-watermark"></div>
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
        <div className="container d-flex justify-content-center">
          {/* <h1 className="navbar-brand text-bold amazecare-logo">AmazeCare</h1> */}
          <img src={logo} alt="SCG Logo" className="navbar-logo" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="text-dark display-4 fw-bold">Welcome to AmazeCare</h1>
        <p className="text-dark lead mt-3">
          Revolutionizing Healthcare with Cutting-Edge Technology
        </p>
        <p className="text-dark">
          AmazeCare is a state-of-the-art hospital management system designed
          to streamline operations, enhance patient care, and elevate the overall healthcare experience.
          Our innovative solution empowers healthcare providers to manage complex tasks efficiently, 
          from patient records and appointments to billing and inventory.
          <br />
          With a user-friendly interface and robust features, AmazeCare is transforming the way healthcare is delivered.
        </p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary me-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-outline-light">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-auto py-3">
        {/* <p className="text-dark fw-light ">Made by @Suyash</p> */}
        <div className="footer-logo-container">
          <img src={footerLogo} alt="Footer Logo" className="footer-logo" />
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
