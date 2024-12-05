import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DoctorLayout.css'; // Include sidebar styles
import { FaBars, FaSignOutAlt, FaTimes, FaCalendarPlus, FaStethoscope, FaClipboardList , FaCalendarAlt,FaFileMedical} from 'react-icons/fa';
import { HiClipboardDocumentList } from "react-icons/hi2";
import { GrSchedules } from "react-icons/gr";
import { FaUserDoctor } from "react-icons/fa6";
import NavLogo from "../../images/nav-logo-cropped.svg"


const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="doctor-layout d-flex bg-light">
            <div className="watermark"></div>

      {/* Sidebar */}
      <div className={`sidebar bg-dark text-light ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
          <h5>Menu</h5>
          <button className="btn btn-dark" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className="list-unstyled px-3">
          <li>
            <NavLink
              to="/doctor-dashboard/appointment-list"
              className={({ isActive }) =>
                isActive ? 'btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center' : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)} // Close sidebar after navigation
            >
              <FaCalendarPlus className="me-2" /> Manage Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctor-dashboard/conduct-consultation"
              className={({ isActive }) =>
                isActive ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center' : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaStethoscope className="me-2" /> Conduct Consultation
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctor-dashboard/medical-records"
              className={({ isActive }) =>
                isActive ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center' : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaFileMedical className="me-2" /> View Medical Records
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctor-dashboard/schedule"
              className={({ isActive }) =>
                isActive ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center' : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <GrSchedules className="me-2" /> Manage Schedule
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctor-dashboard/doctor-billing"
              className={({ isActive }) =>
                isActive ? 'btn m-2 btn-light text-dark w-100 text-start d-flex align-items-center' : 'btn m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)} // Close sidebar after navigation
            >
              <HiClipboardDocumentList className="me-2" /> Manage Billings
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer px-3 py-2">
          <button
            className="btn btn-danger w-100 d-flex align-items-center"
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
          <span className="navbar-brand ms-3"><FaUserDoctor />  Doctor Dashboard</span>
        </nav>
        

        {/* Page Content */}
        <div className="container my-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
