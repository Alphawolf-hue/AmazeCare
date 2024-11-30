import React, { useEffect, useState } from 'react';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  searchDoctorBySpecialization,
} from '../services/DoctorService';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '' });
  const [updateDoctorData, setUpdateDoctorData] = useState({ id: '', name: '', specialization: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorId = localStorage.getItem('doctorId');
        if (!doctorId) {
          console.error('No doctorId found in localStorage');
          return;
        }

        const doctorData = await getDoctorById(doctorId);
        setDoctor(doctorData);

        const allDoctorsData = await getAllDoctors();
        setDoctors(allDoctorsData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleCreateDoctor = async () => {
    try {
      const createdDoctor = await createDoctor(newDoctor);
      setDoctors([...doctors, createdDoctor]);
      setNewDoctor({ name: '', specialization: '' });
    } catch (error) {
      console.error('Error creating doctor', error);
    }
  };

  const handleUpdateDoctor = async () => {
    try {
      const updatedDoctor = await updateDoctor(updateDoctorData.id, updateDoctorData);
      setDoctors(doctors.map((doc) => (doc.id === updatedDoctor.id ? updatedDoctor : doc)));
      setUpdateDoctorData({ id: '', name: '', specialization: '' });
    } catch (error) {
      console.error('Error updating doctor', error);
    }
  };

  const handleSearchBySpecialization = async () => {
    try {
      const result = await searchDoctorBySpecialization(specialization);
      setDoctors(result);
    } catch (error) {
      console.error('Error searching doctors', error);
    }
  };

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <h2>Welcome, Dr. {doctor.name}</h2>

      {/* Appointments Section */}
      <div>
        <h2>Appointments</h2>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              Patient: {appointment.patient.name}, Date: {new Date(appointment.appointmentDate).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {localStorage.getItem('role') === 'Doctor' && (
        <>
          <div>
            <h2>All Doctors</h2>
            <ul>
              {doctors.map((doc) => (
                <li key={doc.id}>
                  Name: {doc.name}, Specialization: {doc.specialization}
                </li>
              ))}
            </ul>
          </div>

          {/* Create Doctor */}
          <div>
            <h2>Create Doctor</h2>
            <input
              type="text"
              placeholder="Name"
              value={newDoctor.name}
              onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Specialization"
              value={newDoctor.specialization}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
            />
            <button onClick={handleCreateDoctor}>Create Doctor</button>
          </div>

          {/* Update Doctor */}
          <div>
            <h2>Update Doctor</h2>
            <input
              type="text"
              placeholder="Doctor ID"
              value={updateDoctorData.id}
              onChange={(e) => setUpdateDoctorData({ ...updateDoctorData, id: e.target.value })}
            />
            <input
              type="text"
              placeholder="Name"
              value={updateDoctorData.name}
              onChange={(e) => setUpdateDoctorData({ ...updateDoctorData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Specialization"
              value={updateDoctorData.specialization}
              onChange={(e) => setUpdateDoctorData({ ...updateDoctorData, specialization: e.target.value })}
            />
            <button onClick={handleUpdateDoctor}>Update Doctor</button>
          </div>

          {/* Search Doctor by Specialization */}
          <div>
            <h2>Search Doctor by Specialization</h2>
            <input
              type="text"
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
            <button onClick={handleSearchBySpecialization}>Search</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;
