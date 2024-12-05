import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminLayout.css'; // Include sidebar styles
import {
  FaBars,
  FaSignOutAlt,
  FaTimes,
  FaUserPlus,
  FaUsers,
  FaClipboardList,
  FaCalendarCheck,
  FaUserShield,
  FaCalendarAlt,
} from 'react-icons/fa';
import { GrSchedules } from "react-icons/gr";
import { GiMedicines } from "react-icons/gi";
import { GiHypodermicTest } from "react-icons/gi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FaUsersLine , FaUserDoctor} from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import NavLogo from "../../images/nav-logo-cropped.svg"


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('authToken'); // Clear auth token
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <div className="admin-layout d-flex bg-light">
            <div className="watermark"></div>

      {/* Sidebar */}
      <div className={`sidebar bg-dark text-light ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header mt-2 ms-3 d-flex justify-content-between align-items-center px-3 py-2">
          <h5>Admin Menu</h5>
          <button className="btn btn-dark" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className="list-unstyled px-3">
          <li>
            <NavLink
              to="/admin-dashboard/register-doctor"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserDoctor className="me-2" /> Register Doctor
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-doctor"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2  btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers className="me-2" /> Manage Doctors
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-patients"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2  btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsersLine className="me-2" /> Manage Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/register-admin"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserShield className="me-2" /> Register Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-doctor-schedule"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <GrSchedules className="me-2" /> Doctor schedule
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-medications"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <GiMedicines className="me-2" /> Manage Medications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-tests"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <GiHypodermicTest className="me-2" /> Manage Tests
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-billing"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <HiClipboardDocumentList className="me-2" /> Manage Billing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/manage-appointment"
              className={({ isActive }) =>
                isActive
                  ? 'btn  m-2 btn-light text-dark w-100 text-start d-flex align-items-center'
                  : 'btn  m-2 btn-dark w-100 text-start d-flex align-items-center'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarAlt className="me-2" /> Manage Appointments
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
          <span className="navbar-brand ms-3 d-none d-md-block"><MdOutlineAdminPanelSettings className='me-3'/>Admin Dashboard</span>
        </nav>

        {/* Page Content */}
        <div className="container my-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
