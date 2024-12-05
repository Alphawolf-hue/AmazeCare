import React, { useState } from 'react';
import AppointmentList from './AppointmentList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LiaPrayingHandsSolid } from "react-icons/lia";



const DoctorDashboard = () => {

  return (
    <div className="container ">
      <h2 className="my-4 text-center"><LiaPrayingHandsSolid className='me-3'/>Welcome to Doctor Dashboard</h2>
      
      <AppointmentList />
    </div>
  );
};

export default DoctorDashboard;
