import React, { useState, useEffect } from "react";
import { Form, Button, Table, Alert, Spinner } from "react-bootstrap";
import { getPatientDetails, updatePatient, deletePatient } from "../../api/admin/adminAPI";
import { FaUsersLine } from "react-icons/fa6";


const ManagePatients = () => {
  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedPatient, setUpdatedPatient] = useState({});

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const response = await getPatientDetails(patientId);
      setPatientDetails(response);
      setUpdatedPatient({ ...response });
      setIsEditing(false); // Reset editing mode
      setAlertMessage("Patient details fetched successfully.");
      setAlertType("success");
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to fetch patient details.");
      setAlertType("danger");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(null),2000);
    }
  };

  const handleUpdatePatient = async () => {
    setLoading(true);
    try {
      const response = await updatePatient(updatedPatient);
      setPatientDetails(response);
      setAlertMessage("Patient updated successfully.");
      setAlertType("success");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update patient.");
      setAlertType("danger");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(null),2000);
    }
  };

  const handleDeletePatient = async () => {
    setLoading(true);
    try {
      await deletePatient(patientDetails.userID, patientDetails.patientID);
      setAlertMessage("Patient deleted successfully.");
      setAlertType("success");
      setPatientDetails(null); // Clear the details after deletion
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to delete patient.");
      setAlertType("danger");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(null),2000);
    }
  };

  return (
    <div className="container-fluid text-dark min-vh-100 py-1">
      <h2 className="text-dark"><FaUsersLine className="me-3"/>Manage Patients</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {alertMessage && (
        <Alert variant={alertType} onClose={() => setAlertMessage("")} dismissible>
          {alertMessage}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label className="text-dark h6">Enter Patient ID</Form.Label>
        <div className="d-flex w-100">
          <Form.Control
            type="text"
            value={patientId}
            className="Text-dark bg-light border-dark rounded-pill"
            onChange={(e) => setPatientId(e.target.value)}
          />
          <Button variant="dark" className="ms-2 fst-italic rounded-pill" onClick={fetchPatientDetails} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Search"}
          </Button>
        </div>
      </Form.Group>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {patientDetails && (
        <>
          <Table striped borderless hover className="mt-4">
            <tbody>
            <tr>
                <th>User ID</th>
                <td>
                  {patientDetails.userID}
                </td>
              </tr>
              
              <tr>
                <th>Full Name</th>
                <td>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      value={updatedPatient.fullName}
                      className="rounded-3 bg-light text-dark border-dark-subtle"
                      onChange={(e) =>
                        setUpdatedPatient({ ...updatedPatient, fullName: e.target.value })
                      }
                    />
                  ) : (
                    patientDetails.fullName
                  )}
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>
                  {isEditing ? (
                    <Form.Control
                      type="email"
                      className="rounded-3 bg-light text-dark border-dark-subtle"
                      value={updatedPatient.email}
                      onChange={(e) =>
                        setUpdatedPatient({ ...updatedPatient, email: e.target.value })
                      }
                    />
                  ) : (
                    patientDetails.email
                  )}
                </td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>
                  {isEditing ? (
                    <Form.Control
                      type="date"
                      value={updatedPatient.dateOfBirth}
                      className="rounded-3 bg-light text-dark border-dark-subtle"
                      onChange={(e) =>
                        setUpdatedPatient({ ...updatedPatient, dateOfBirth: e.target.value })
                      }
                    />
                  ) : (
                    new Date(patientDetails.dateOfBirth).toLocaleDateString()
                  )}
                </td>
              </tr>
              <tr>
                <th>Contact Number</th>
                <td>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      value={updatedPatient.contactNumber}
                      className="rounded-3 bg-light text-dark border-dark-subtle"
                      onChange={(e) =>
                        setUpdatedPatient({ ...updatedPatient, contactNumber: e.target.value })
                      }
                    />
                  ) : (
                    patientDetails.contactNumber
                  )}
                </td>
              </tr>
              <tr>
                <th>Address</th>
                <td>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      value={updatedPatient.address}
                      className="rounded-3 bg-light text-dark border-dark-subtle"
                      onChange={(e) =>
                        setUpdatedPatient({ ...updatedPatient, address: e.target.value })
                      }
                    />
                  ) : (
                    patientDetails.address
                  )}
                </td>
              </tr>
              <tr>
                <th>Medical History</th>
                <td>
                  {isEditing ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={updatedPatient.medicalHistory}
                      className="rounded-3 bg-light text-dark border-dark-subtle"
                      onChange={(e) =>
                        setUpdatedPatient({ ...updatedPatient, medicalHistory: e.target.value })
                      }
                    />
                  ) : (
                    patientDetails.medicalHistory
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
          <hr class="border border-dark border-1 opacity-100"></hr>


          <div className="d-flex justify-content-between mt-4">
            {isEditing ? (
              <>
                <Button variant="success" className="fst-italic rounded-pill" onClick={handleUpdatePatient} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                </Button>
                <Button variant="danger"  className="fst-italic rounded-pill" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="warning"  className="fst-italic rounded-pill" onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
                <Button variant="danger" className="fst-italic rounded-pill"  onClick={handleDeletePatient} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Delete Patient"}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManagePatients;
