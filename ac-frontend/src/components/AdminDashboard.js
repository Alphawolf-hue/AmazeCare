import React, { useEffect, useState } from 'react';
import { getAllDoctors, getAllPatients, getAllAdmins } from '../services/AdminService';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await getAllDoctors();
        setDoctors(doctorsData);
        const patientsData = await getAllPatients();
        setPatients(patientsData);
        const adminsData = await getAllAdmins();
        setAdmins(adminsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Doctors</h2>
        <ul>
          {doctors.map(doctor => (
            <li key={doctor.id}>{doctor.name} - {doctor.specialization}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Patients</h2>
        <ul>
          {patients.map(patient => (
            <li key={patient.id}>{patient.name} - {patient.age}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Admins</h2>
        <ul>
          {admins.map(admin => (
            <li key={admin.adminID}>{admin.fullName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
