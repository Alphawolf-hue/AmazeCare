import React, { useState } from 'react';
import { getDoctorSchedule, scheduleAppointment } from '../../api/patient/patientAPI';
import { Table, Alert } from 'react-bootstrap';
import {FaCalendarPlus, FaClipboardList} from 'react-icons/fa'
const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctorID: '',
    appointmentDate: '',
    symptoms: '',
  });
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [noScheduleMessage, setNoScheduleMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await scheduleAppointment(formData);
      setMessage(response.message);
      setAlertType('success');
      setFormData({ doctorID: '', appointmentDate: '', symptoms: '' });
    } catch (error) {
      setMessage(error.response?.data || 'Failed to schedule appointment.');
      setAlertType('danger');
    }
  };

  const formatDateTimeForDisplay = (date) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 
  const checkAvailability = async () => {
    if (!formData.doctorID) {
      setNoScheduleMessage('Please enter a valid Doctor ID.');
      return;
    }
  
    console.log(`Checking Schedule for Doctor ID: ${formData.doctorID}`);
    
    try {
      const scheduleData = await getDoctorSchedule(formData.doctorID);
      console.log('Schedule Data:', scheduleData);
      setSchedule(scheduleData);
      setNoScheduleMessage('');
    } catch (error) {
      console.error('Error fetching Schedule:', error);
      setNoScheduleMessage('No Upcoming Schedule found for this doctor.');
      setSchedule([]);
    }
  };
  

  return (
    <div className="container mt-5 text-dark min-vh-100">
      <h2 className="mb-4"><FaCalendarPlus className='me-3'/>Request Appointment</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {message && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          {message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label h5">Doctor ID</label>
          <input
            type="text"
            name="doctorID"
            className="form-control bg-light text-dark border-dark"
            value={formData.doctorID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label h5">Appointment Date & Time</label>
          <input
            type="datetime-local"
            name="appointmentDate"
            className="form-control bg-light text-dark border-dark"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label h6">Symptoms</label>
          <textarea
            name="symptoms"
            className="form-control bg-light text-dark border-dark"
            rows="4"
            value={formData.symptoms}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-dark text-light rounded-pill ">Book Appointment</button>
        </div>
      </form>
      <hr class="border border-dark border-1 opacity-50"></hr>

      <div className="mt-5">
        <h3 className='fst-italic'>Check Doctor Availability</h3>
        <button onClick={checkAvailability} className="btn btn-dark text-light mb-3 rounded-pill" disabled={!formData.doctorID}>
          Check Availability
        </button>

        {noScheduleMessage && (
          <Alert variant="info">
            {noScheduleMessage}
          </Alert>
        )}

        {schedule.length > 0 && (
          <Table striped borderless hover responsive>
            <thead className='table-group-divider'>
              <tr>
                <th>Index</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((schedule,index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{formatDateTimeForDisplay(schedule.startDate)}</td>
                  <td>{formatDateTimeForDisplay(schedule.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <hr class="border border-dark border-1 opacity-50"></hr>

    </div>
  );
};

export default BookAppointment;
