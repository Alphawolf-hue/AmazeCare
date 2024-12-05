import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Form } from "react-bootstrap";
import { getAppointments, cancelAppointment, rescheduleAppointment } from "../../api/patient/patientAPI";
import {FaCalendarAlt} from 'react-icons/fa'

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; 

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      showAlert(error.message || "Error fetching appointments", "danger");
    }
  };

  // Handle cancel appointment
  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      showAlert("Appointment canceled successfully", "success");
      fetchAppointments();
    } catch (error) {
      showAlert(error.message || "Error canceling appointment", "danger");
    }
  };

  // Handle reschedule appointment
  const handleReschedule = async (appointmentId) => {
    if (!newDateTime) {
      showAlert("Please select a new date and time.", "warning");
      return;
    }
    try {
      const payload = { newAppointmentDate: newDateTime };
      await rescheduleAppointment(appointmentId, payload);
      showAlert("Appointment rescheduled successfully", "success");
      fetchAppointments();
      setEditingAppointment(null);
    } catch (error) {
      showAlert(error.message || "The doctor is not available on chosen date and time , Please check doctors schedule", "danger");
    }
  };

  // Show alert with auto-hide
  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 2000);
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) =>
    filter === "All" ? true : appointment.status === filter
  );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to the first page
  };

  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDateTimeForDisplay = (date) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTimeForInput = (date) => {
    const isoString = new Date(date).toISOString();
    return isoString.slice(0, 16); // Extract YYYY-MM-DDTHH:mm format
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container mt-4 text-dark min-vh-100 ">
      <h2><FaCalendarAlt className="me-3"/> My Appointments</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}

      <div className="mb-3">
          {["All", "Scheduled", "Requested", "Completed", "Canceled"].map((filterName) => (
             <Button
              key={filterName}
              variant={filter === filterName ? "dark" : "outline-dark"}
              onClick={() => handleFilterChange(filterName)}
              className="me-2 rounded-pill fst-italic"
            >
            {filterName}
           </Button>
          ))}
          </div>
          

      <Table striped bordereless hover responsive>
        <thead className="table-group-divider">
          <tr>
            <th>Appointment ID</th>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppointments.map((appointment) => (
            <tr key={appointment.appointmentID}>
              <td>{appointment.appointmentID}</td>
              <td>{appointment.doctorID}</td>
              <td>{appointment.doctorName}</td>
              <td>
                {editingAppointment === appointment.appointmentID ? (
                  <Form.Control
                    type="datetime-local"
                    value={newDateTime}
                    step="60"
                    onChange={(e) => setNewDateTime(e.target.value)}
                  />
                ) : (
                  formatDateTimeForDisplay(appointment.appointmentDate)
                )}
              </td>
              <td>{appointment.status}</td>
              <td>
                {["Scheduled", "Requested"].includes(appointment.status) && (
                  <>
                    {editingAppointment === appointment.appointmentID ? (
                      <>
                        <Button
                          variant="success rounded-pill fst-italic"
                          className="me-2"
                          onClick={() => handleReschedule(appointment.appointmentID)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary rounded-pill fst-italic"
                          onClick={() => setEditingAppointment(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="warning"
                          className="me-2 rounded-pill fst-italic"
                          onClick={() => {
                            setEditingAppointment(appointment.appointmentID);
                            setNewDateTime(formatDateTimeForInput(appointment.appointmentDate));
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="danger rounded-pill fst-italic"
                          onClick={() => handleCancel(appointment.appointmentID)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <hr class="border border-dark border-1 opacity-100"></hr>


       {/* Pagination Controls */}
       {filteredAppointments.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fst-italic">
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
      )}

    </div>
  );
};

export default AppointmentsPage;
