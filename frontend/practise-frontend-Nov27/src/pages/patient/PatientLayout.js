import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientLayout.css'; 
import {
  FaBars,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaSearch,
  FaNotesMedical,
  FaCalendarAlt,
  FaUserInjured,
  FaCalendarPlus,
  FaClipboardList
} from 'react-icons/fa';
import NavLogo from "../../images/nav-logo-cropped.svg"


const PatientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
    if (!sidebarOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('authToken'); 
    window.location.href = '/login'; 
  };

  return (
    <div className="patient-layout d-flex bg-light">
      <div className="watermark"></div>
      {/* Sidebar */}
      <div className={`sidebar bg-dark text-light ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
          <h5>Menu</h5>
          <button className="btn btn-dark" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className="list-unstyled px-3">
          <li>
            <NavLink
              to="/patient-dashboard/personal-info"
              className={({ isActive }) =>
                isActive
                  ? 'btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserCircle className="me-2" /> Personal Info
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient-dashboard/search-doctors"
              className={({ isActive }) =>
                isActive
                  ? 'btn m-2  btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaSearch className="me-2" /> Search Doctors
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient-dashboard/patient-medical-records"
              className={({ isActive }) =>
                isActive
                  ? ' btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaNotesMedical className="me-2" /> Medical Records
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient-dashboard/book-appointment"
              className={({ isActive }) =>
                isActive
                  ? 'btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarPlus className="me-2" /> Request Appointment
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient-dashboard/patient-billing"
              className={({ isActive }) =>
                isActive
                  ? 'btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaClipboardList className="me-2" /> My Bills
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient-dashboard/appointments-page"
              className={({ isActive }) =>
                isActive
                  ? 'btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarAlt className="me-2" /> My Appointments
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer px-3 py-2">
          <button
            className="btn m-2 btn-danger w-100 d-flex align-items-center"
            onClick={logout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1">
        {/* Navbar */}
        <nav className="navbar navbar-dark bg-dark px-3">
          <button className="btn btn-dark" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="navbar-logo">
            <img
              src={NavLogo} // Replace with your SVG path
              alt="Logo"
              height="40"
            />
          </div>
       <span className="navbar-brand ms-3"><FaUserInjured className='me-3'/>Patient Dashboard</span>
        </nav>

        {/* Page Content */}
        <div className="container my-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PatientLayout;
