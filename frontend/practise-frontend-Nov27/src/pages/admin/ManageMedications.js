import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import {
  getAllMedications,
  addMedication,
  updateMedication,
} from '../../api/admin/adminAPI';
import { GiMedicines } from "react-icons/gi";


const ManageMedications = () => {
  const [medications, setMedications] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [newMedication, setNewMedication] = useState({
    medicationName: '',
    pricePerUnit: '',
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await getAllMedications();
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.medicationName || !newMedication.pricePerUnit) return;

    try {
      await addMedication(newMedication);
      setAlertMessage('Medication added successfully.');
      setNewMedication({ medicationName: '', pricePerUnit: '' });
      fetchMedications();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleUpdateMedication = async (medicationId, updatedMedication) => {
    try {
      await updateMedication(medicationId, updatedMedication);
      setAlertMessage('Medication updated successfully.');
      setIsEditing(null);
      fetchMedications();
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <div className="manage-medications min-vh-100 text-dark">
      {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
      <h2 className="mb-4"><GiMedicines className='me-3'/>Manage Medications</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      <div className="add-medication-form mb-3">
        <h4>Add Medication</h4>
        <Form>
          <Form.Group className="mb-2" controlId="medicationName">
            <Form.Label>Medication Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter medication name"
              className='bg-light text-dark border-dark rounded-pill'
              value={newMedication.medicationName}
              onChange={(e) =>
                setNewMedication({ ...newMedication, medicationName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="pricePerUnit">
            <Form.Label>Price Per Unit</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price per unit"
              className='bg-light text-dark border-dark rounded-pill'
              value={newMedication.pricePerUnit}
              onChange={(e) =>
                setNewMedication({ ...newMedication, pricePerUnit: e.target.value })
              }
            />
          </Form.Group>
          <Button onClick={handleAddMedication} className=' fst-italic btn btn-dark rounded-pill text-light'>Add Medication</Button>
        </Form>

      </div>
      <Table striped borderless hover responsive >
        <thead className='table-group-divider'>
          <tr>
            <th>Medication ID</th>
            <th>Medication Name</th>
            <th>Price Per Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='align-content-center'>
          {medications.map((medication) =>
            isEditing === medication.medicationID ? (
              <tr key={medication.medicationID}>
                <td>{medication.medicationID}</td>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={medication.medicationName}
                    onChange={(e) =>
                      (medication.medicationName = e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    defaultValue={medication.pricePerUnit}
                    onChange={(e) =>
                      (medication.pricePerUnit = parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="success"
                    className=' rounded-pill text-light fst-italic'
                    onClick={() =>
                      handleUpdateMedication(medication.medicationID, medication)
                    }
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ) : (
              <tr key={medication.medicationID}>
                <td>{medication.medicationID}</td>
                <td>{medication.medicationName}</td>
                <td>{medication.pricePerUnit}</td>
                <td>
                  <Button
                    variant="dark"
                    onClick={() => setIsEditing(medication.medicationID)}
                    className='rounded-pill text-light fst-italic'
                  >
                    Update
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      <hr class="border border-dark border-1 opacity-100"></hr>

    </div>
  );
};

export default ManageMedications;
