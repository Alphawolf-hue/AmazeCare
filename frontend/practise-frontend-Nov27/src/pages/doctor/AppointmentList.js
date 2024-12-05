import React, { useState, useEffect } from 'react';
import { getAppointmentsByStatus, cancelAppointment, rescheduleAppointment, approveAppointment } from '../../api/doctor/appointmentApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarPlus } from "react-icons/fa";

const AppointmentList = () => {
  const [statusFilter, setStatusFilter] = useState('Scheduled');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [searchName, setSearchName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  useEffect(() => {
    let filtered = appointments;

    if (searchName.trim()) {
      filtered = filtered.filter((appt) =>
        appt.patientName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (appt) => new Date(appt.appointmentDate).toDateString() === new Date(filterDate).toDateString()
      );
    }

     // Sort by date
     filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return sortOrderAsc ? dateA - dateB : dateB - dateA;
    });

    setFilteredAppointments(filtered);
    setCurrentPage(1); 
  }, [appointments, searchName, filterDate,sortOrderAsc]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchAppointments = async () => {
    try {
      const fetchedAppointments = await getAppointmentsByStatus(statusFilter);
      setAppointments(Array.isArray(fetchedAppointments) ? fetchedAppointments : fetchedAppointments?.$values || []);
    } catch (error) {
      setAlert({ message: 'Error fetching appointments.', type: 'danger' });
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      setAlert({ message: 'Appointment canceled successfully.', type: 'success' });
      fetchAppointments();
    } catch (error) {
      setAlert({ message: 'Error canceling the appointment.', type: 'danger' });
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      await approveAppointment(appointmentId);
      setAlert({ message: 'Appointment approved successfully.', type: 'success' });
      fetchAppointments();
    } catch (error) {
      setAlert({ message: 'Error approving the appointment.', type: 'danger' });
    }
  };

  const handleRescheduleClick = (appointment) => {
    setEditingAppointmentId(appointment.appointmentID);
    setRescheduleDateTime(new Date(appointment.appointmentDate).toISOString().slice(0, 16));
    setAlert({ message: '', type: '' });
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleDateTime || new Date(rescheduleDateTime) <= new Date()) {
      setAlert({ message: 'Please select a valid future date and time.', type: 'warning' });
      return;
    }

    try {
      const rescheduleData = { newAppointmentDate: rescheduleDateTime };
      await rescheduleAppointment(editingAppointmentId, rescheduleData);
      setAlert({ message: 'Appointment rescheduled successfully.', type: 'success' });
      setEditingAppointmentId(null);
      setRescheduleDateTime('');
      fetchAppointments();
    } catch (error) {
      setAlert({ message: 'Error rescheduling the appointment.', type: 'danger' });
    }
  };

  const handleRescheduleCancel = () => {
    setEditingAppointmentId(null);
    setRescheduleDateTime('');
    setAlert({ message: '', type: '' });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const handleSortToggle = () => {
    setSortOrderAsc(!sortOrderAsc);
  };

  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className='text-dark min-vh-100'>
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setAlert({ message: '', type: '' })}
          ></button>
        </div>
      )}

        <h3 className="mb-3 text-dark bold"><FaCalendarPlus /> Filter and Search Appointments</h3>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Patient Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="form-control mb-2 border-dark text-dark bg-light rounded-pill"
        />
        <input
          type="date"
          placeholder="Filter by Date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="form-control border-dark text-dark bg-light rounded-pill"
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group fst-italic">
          {['Scheduled','Requested', 'Canceled', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-outline-dark rounded-pill fst-italic me-2  ${statusFilter === status ? 'active' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={handleSortToggle}
          className="btn btn-outline-dark fst-italic rounded-pill"
          title={`Sort by Date (${sortOrderAsc ? 'Ascending' : 'Descending'})`}
        >
          Sort by Date {sortOrderAsc ? '↑' : '↓'}
        </button>
      </div>

      <table className="table table-responsive table-hover table-borderless table-striped">
        <thead className="table-group-divider">
          <tr>
            <th>Appointment ID</th>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Symptoms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody lass="table-group-divider">
          {currentItems.length > 0 ? (
            currentItems.map((appt) => (
              <tr key={appt.appointmentID}>
                <td>{appt.appointmentID}</td>
                <td>{appt.patientID}</td>
                <td>{appt.patientName}</td>
                <td>
                  {editingAppointmentId === appt.appointmentID ? (
                    <>
                      <input
                        type="datetime-local"
                        value={rescheduleDateTime}
                        onChange={(e) => setRescheduleDateTime(e.target.value)}
                        className="form-control"
                      />
                      <button
                        onClick={handleRescheduleSubmit}
                        className="btn btn-success btn-sm mt-2 me-2 fst-italic rounded-pill"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={handleRescheduleCancel}
                        className="btn btn-secondary btn-sm mt-2 fst-italic rounded-pill"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    formatDateTime(appt.appointmentDate)
                  )}
                </td>
                <td>{appt.status}</td>
                <td>{appt.symptoms || 'N/A'}</td>
                <td>
                  {appt.status === 'Scheduled' && editingAppointmentId !== appt.appointmentID && (
                    <>
                      <button
                        onClick={() => handleCancel(appt.appointmentID)}
                        className="btn btn-danger btn-sm mx-1 fst-italic rounded-pill"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRescheduleClick(appt)}
                        className="btn btn-warning btn-sm mx-1 fst-italic rounded-pill"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {appt.status === 'Requested' && (
                    <>
                      <button
                        onClick={() => handleApprove(appt.appointmentID)}
                        className="btn btn-success btn-sm mx-1 fst-italic rounded-pill"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRescheduleClick(appt)}
                        className="btn btn-warning btn-sm mx-1 fst-italic rounded-pill"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center fst-italic text-dark">
                No appointments found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <hr class="border border-dark border-1 opacity-100"></hr>

      <div className="d-flex justify-content-between align-items-center">
        <span className='fst-italic'>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <button
            className="btn btn-outline-dark me-2 fst-italic rounded-pill"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-dark fst-italic rounded-pill"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default AppointmentList;
