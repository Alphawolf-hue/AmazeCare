import React, { useState } from "react";
import { Form, Button, Table, Alert, Spinner } from "react-bootstrap";
import { getAppointmentDetails, rescheduleAppointment } from "../../api/admin/adminAPI";
import {FaCalendarAlt} from "react-icons/fa";

const ManageAppointment = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState("");

  const handleFetchAppointment = async () => {
    setLoading(true);
    try {
      console.log(`Fetching details for Appointment ID: ${appointmentId}`);
      const response = await getAppointmentDetails(appointmentId);
      console.log("Fetched Appointment Details:", response);
      setAppointmentDetails(response);
      setAlert({ message: "", type: "" });
    } catch (error) {
      console.error("Error fetching appointment details:", error.response || error);
      setAlert({ message: "Error fetching appointment details.", type: "danger" });
      setAppointmentDetails(null);
    } finally {
      setLoading(false);
    }
  };
  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  
  const handleRescheduleAppointment = async () => {
    setRescheduling(true);
    try {
      const payload = { newAppointmentDate };
      console.log(`Rescheduling Appointment ID: ${appointmentId} with payload:`, payload);
      const response = await rescheduleAppointment(appointmentId, payload);
      console.log("Rescheduled Appointment Response:", response);
      setAlert({ message: "Appointment rescheduled successfully!", type: "success" });
      setAppointmentDetails(response); // Update details after rescheduling
    } catch (error) {
      console.error("Error rescheduling appointment:", error.response || error);
      setAlert({
        message: error.response?.data || "Error rescheduling appointment.",
        type: "danger",
      });
    } finally {
      setRescheduling(false);
      setTimeout(() => setAlert({ message: "", type: "" }), 2000);
    }
  };

  return (
    <div className="container-fluid text-dark min-vh-100 py-1">
      <h2><FaCalendarAlt className="me-3"/>Manage Appointments</h2>

      {alert.message && (
        <Alert variant={alert.type} className="mt-3">
          {alert.message}
        </Alert>
      )}
      <hr class="border border-dark border-1 opacity-100"></hr>


      {/* Fetch Appointment Form */}
      <Form className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label className="text-dark h6">Appointment ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter appointment ID"
            className="rounded-pill border-dark text-dark bg-light"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
          />
        </Form.Group>
        <Button variant="dark" className="rounded-pill fst-italic text-light " onClick={handleFetchAppointment} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Search"}
        </Button>
      </Form>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {/* Appointment Details Table */}
      {appointmentDetails && (
        <Table bordereless striped hover responsive className="mt-4">
          <tbody>
         
            <tr>
              <td className="fw-semibold">Patient Name</td>
              <td>{appointmentDetails.patient?.fullName || "N/A"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Doctor Name</td>
              <td>{appointmentDetails.doctor?.fullName || "N/A"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Appointment Date</td>
              <td>{formatDateTime(appointmentDetails.appointmentDate)}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Status</td>
              <td>{appointmentDetails.status || "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      )}


      {/* Reschedule Form */}
      {appointmentDetails && appointmentDetails.status === "Scheduled" && (
        <Form className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">New Appointment Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={newAppointmentDate}
              className="rounded-pill text-dark border-dark bg-light"
              onChange={(e) => setNewAppointmentDate(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="warning"
            className="rounded-pill fst-italic"
            onClick={handleRescheduleAppointment}
            disabled={rescheduling}
          >
            {rescheduling ? <Spinner animation="border" size="sm" /> : "Reschedule Appointment"}
          </Button>
        </Form>
        
      )}

    </div>
  );
};

export default ManageAppointment;
