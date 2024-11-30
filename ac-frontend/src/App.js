import React from 'react';
import { Routes, Route,Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { AuthProvider } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardRedirect from './components/DashboardRedirect';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardRedirect/>}/>
        <Route element={<PrivateRoute role="Doctor" />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Route>
        <Route element={<PrivateRoute role="Patient" />}>
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
        </Route>
        <Route element={<PrivateRoute role="Admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<PrivateRoute role="User" />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
