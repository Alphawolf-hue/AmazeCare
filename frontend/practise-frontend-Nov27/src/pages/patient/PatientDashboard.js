import React from 'react';
import PersonalInfo from './PersonalInfo';
import { LiaPrayingHandsSolid } from "react-icons/lia";


const PatientDashboard = () => {

  return (
    <div className="container">
      <h2 className='text-center my-4'><LiaPrayingHandsSolid className='me-3'/>Welcome to Patient Dashboard</h2>
      <PersonalInfo />
      
    </div>
  );
};

export default PatientDashboard;
