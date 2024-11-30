import React, { useEffect, useState } from 'react';
import { getPatientById } from '../services/PatientService';
import { getAllPrescriptions } from '../services/PrescriptionService';

const PatientDashboard = () => {
  const [patient, setPatient] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientById(localStorage.getItem('patientId'));
        setPatient(patientData);
        const prescriptionsData = await getAllPrescriptions();
        setPrescriptions(prescriptionsData.filter(prescription => prescription.patientId === patient.id));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [patient.id]);

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <h2>Welcome, {patient.name}</h2>
      <div>
        <h2>Prescriptions</h2>
        <ul>
          {prescriptions.map(prescription => (
            <li key={prescription.id}>
              Medications: {prescription.medications}, Date: {new Date(prescription.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientDashboard;
