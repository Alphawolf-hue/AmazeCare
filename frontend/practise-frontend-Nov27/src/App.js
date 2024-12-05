import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  , Outlet} from 'react-router-dom';

import Login from './pages/login/Login';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/PrivateRoute';
import ConductConsultation from './pages/doctor/ConductConsultation';
import MedicalRecords from './pages/doctor/MedicalRecords';
import Schedule from './pages/doctor/Schedule';
import PersonalInfo from './pages/patient/PersonalInfo';
import SearchDoctors from './pages/patient/SearchDoctors';
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import BookAppointment from './pages/patient/BookAppointment';
import RegisterDoctor from './pages/admin/RegisterDoctor';
import ManageDoctor from './pages/admin/ManageDoctor';
import ManagePatients from './pages/admin/ManagePatients';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import ManageAppointments from './pages/admin/ManageAppointments';
import DoctorLayout from './pages/doctor/DoctorLayout';
import AppointmentList from './pages/doctor/AppointmentList';
import PatientLayout from './pages/patient/PatientLayout';
import AdminLayout from './pages/admin/AdminLayout';
import PageWrapper from './utils/PageWrapper';
import Signup from './pages/signup/Signup';
import MainPage from './pages/main/MainPage';
import ManageDoctorSchedule from './pages/admin/ManageDoctorSchedule';
import ManageBilling from './pages/admin/ManageBilling';
import ManageMedications from './pages/admin/ManageMedications';
import ManageTests from './pages/admin/ManageTests';
import DoctorBilling from './pages/doctor/DoctorBilling';
import PatientBilling from './pages/patient/PatientBilling';

function App() {
  
  return (
    <Router>
     
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login  />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<PrivateRoute />}>
        <Route path="/doctor-dashboard" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointment-list" element={<AppointmentList />} />
        <Route path="conduct-consultation" element={<ConductConsultation />} />
        <Route path="medical-records" element={<MedicalRecords />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="doctor-billing" element={<DoctorBilling />} />

      </Route>
      <Route path="/patient-dashboard" element={<PatientLayout />}>
       <Route index element={<PatientDashboard />} />
        <Route path="personal-info" element={<PersonalInfo />} />
       <Route path="search-doctors" element={<SearchDoctors />} />
       <Route path="patient-medical-records" element={<MedicalRecordsPage />} />
       <Route path="book-appointment" element={<BookAppointment />} />
      <Route path="appointments-page" element={<AppointmentsPage />} />
      <Route path="patient-billing" element={<PatientBilling />} />
  </Route>

  <Route path="/admin-dashboard" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="register-doctor" element={<RegisterDoctor />} />
  <Route path="manage-doctor" element={<ManageDoctor />} />
  <Route path="manage-patients" element={<ManagePatients />} />
  <Route path="register-admin" element={<RegisterAdmin />} />
  <Route path="manage-appointment" element={<ManageAppointments />} />
  <Route path="manage-doctor-schedule" element={<ManageDoctorSchedule />} />
  <Route path="manage-billing" element={<ManageBilling />} />
  <Route path="manage-medications" element={<ManageMedications />} />
  <Route path="manage-tests" element={<ManageTests />} />

</Route>     
       </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
  );
}

export default App;
