import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Ensure this is imported to apply the custom styles

const Home = () => {
  return (
    <main className="container text-center mt-5">
      <h1 className="display-4">Welcome to AmazeCare Hospitals</h1>
      <p className="lead">Your health management solution.</p>
      <div className="row mt-4">
        <div className="col-md-4">
          <img src="https://images.unsplash.com/photo-1580281657702-257584239a55?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="img-fluid rounded home-image" alt="Managing Appointments" />
          <h5 className="mt-2">Get World Class Services</h5>
          <p>Get Solutions for all of your Health Problems.</p>
        </div>
        <div className="col-md-4">
          <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fG1hbmFnaW5nJTIwSGVhbHRoJTIwQXBwb2ludG1lbnRzfGVufDB8fDB8fHww" className="img-fluid rounded home-image" alt="Tracking Health" />
          <h5 className="mt-2">Track Your Health</h5>
          <p>Keep track of your Health records with ease.</p>
        </div>
        <div className="col-md-4">
          <img src="https://plus.unsplash.com/premium_photo-1673958772266-611f7103ab11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q3BubmVjdCUyMHdpdGglMjBhJTIwRG9jdG9yfGVufDB8fDB8fHww" className="img-fluid rounded home-image" alt="Connecting with Doctors" />
          <h5 className="mt-2">Connect with Doctors</h5>
          <p>Get in touch with medical professionals quickly and efficiently.</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
