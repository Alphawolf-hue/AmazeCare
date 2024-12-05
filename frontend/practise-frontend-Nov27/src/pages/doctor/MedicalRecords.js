import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getPatientMedicalRecords, updateMedicalRecord, updateBillingStatus } from '../../api/doctor/doctor';
import { FaFileMedical } from "react-icons/fa";
const formatDateTime = (date) => {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MedicalRecords = () => {
  const [patientId, setPatientId] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [apiMessage, setApiMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true); // State to track sort order

  const recordsPerPage = 1;

  const fetchMedicalRecords = async () => {
    try {
      setApiMessage('');
      const data = await getPatientMedicalRecords(patientId);
      setMedicalRecords(data);
    } catch (err) {
      setApiMessage('Failed to fetch medical records. Please try again.');
    }
  };

  const handleUpdateRecord = async (recordId, updatedData) => {
    try {
      const response = await updateMedicalRecord(recordId, patientId, updatedData);
      setApiMessage('Medical record updated successfully.');
      fetchMedicalRecords();
      setEditingRecord(null);
    } catch (err) {
      setApiMessage('Failed to update medical record. Please try again.');
    }
  };

  const handleUpdateBilling = async (billingId) => {
    try {
      await updateBillingStatus(billingId);
      setApiMessage('Billing status updated to Paid.');
      fetchMedicalRecords();
    } catch (err) {
      setApiMessage('Failed to update billing status. Please try again.');
    }
  };

  const handleSearch = (record) => {
    const query = searchQuery.toLowerCase();
    return (
      record.medicalRecordID?.toString().includes(query) ||
      record.symptoms?.toLowerCase().includes(query) ||
      record.physicalExamination?.toLowerCase().includes(query) ||
      record.treatmentPlan?.toLowerCase().includes(query)
    );
  };


const handleSort = () => {
  const sortedRecords = [...medicalRecords].sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);

    return isAscending ? dateA - dateB : dateB - dateA;
  });
  setMedicalRecords(sortedRecords);
  setIsAscending(!isAscending); // Toggle sort order
};


  // const handleSort = () => {
  //   const sortedRecords = [...medicalRecords].sort(
  //     (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
  //   );
  //   setMedicalRecords(sortedRecords);
  // };

  const totalRecords = medicalRecords.filter(handleSearch).length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const paginatedRecords = medicalRecords
    .filter(handleSearch)
    .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="container text-dark min-vh-100">
      <h2 className="my-4"><FaFileMedical className='me-3'/>Medical Records</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      <div className="mb-4 d-flex flex-column flex-md-row gap-2 ">
        <input
          type="number"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="form-control border-dark-subtle text-dark bg-light rounded-pill"
        />
        <button onClick={fetchMedicalRecords} className="btn btn-dark text-light fst-italic rounded-pill">
          Search
        </button>
      </div>
      <div className="mb-4 d-flex flex-column flex-md-row gap-2">
        <input
          type="text"
          placeholder="Search by ID, Symptoms, Examination, or Treatment"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control border-dark-subtle text-dark bg-light rounded-pill"
        />
       <button onClick={handleSort} className="btn btn-dark text-light fst-italic rounded-pill">
           SortBy{isAscending ? '↑' : '↓'}
        </button>
        

      </div>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {apiMessage && (
        <div className={`alert ${apiMessage.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
          {apiMessage}
        </div>
      )}

      {paginatedRecords.map((record, index) => (
        <div key={`medical-record-${record.medicalRecordID || index}`} className="mb-5">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className='fw-bold'>Medical Record ID: {record.medicalRecordID || 'N/A'}</h4>
            <h5 className='fst-italic'>Appointment Date: {formatDateTime(record.appointmentDate)}</h5>
          </div>
          <h5 className='fst-italic text-decoration-underline'>Doctor: {record.doctorName}</h5>

          {/* Inline Editing */}
          {editingRecord === record.medicalRecordID ? (
            <>
              <div>
                <label>Symptoms:</label>
                <input
                  type="text"
                  defaultValue={record.symptoms || ''}
                  className="form-control mb-2"
                  onChange={(e) => (record.symptoms = e.target.value)}
                />
              </div>
              <div>
                <label>Physical Examination:</label>
                <input
                  type="text"
                  defaultValue={record.physicalExamination || ''}
                  className="form-control mb-2"
                  onChange={(e) => (record.physicalExamination = e.target.value)}
                />
              </div>
              <div>
                <label>Treatment Plan:</label>
                <input
                  type="text"
                  defaultValue={record.treatmentPlan || ''}
                  className="form-control mb-2"
                  onChange={(e) => (record.treatmentPlan = e.target.value)}
                />
              </div>
              <div>
                <label>Follow-Up Date:</label>
                <input
                  type="datetime-local"
                  defaultValue={new Date(record.followUpDate).toISOString().slice(0, 16)}
                  className="form-control mb-2"
                  onChange={(e) => (record.followUpDate = e.target.value)}
                />
              </div>
              <button
                onClick={() =>
                  handleUpdateRecord(record.medicalRecordID, {
                    symptoms: record.symptoms,
                    physicalExamination: record.physicalExamination,
                    treatmentPlan: record.treatmentPlan,
                    followUpDate: record.followUpDate,
                  })
                }
                className="btn btn-success me-2 fst-italic rounded-pill"
              >
                Save Changes
              </button>
              <button onClick={() => setEditingRecord(null)} className="btn btn-secondary fst-italic rounded-pill">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Symptoms:</strong> {record.symptoms || 'N/A'}</p>
              <p><strong>Physical Examination:</strong> {record.physicalExamination || 'N/A'}</p>
              <p><strong>Treatment Plan:</strong> {record.treatmentPlan || 'N/A'}</p>
              <p><strong>Follow-Up Date:</strong> {record.followUpDate ? formatDateTime(record.followUpDate) : 'N/A'}</p>
              <button onClick={() => setEditingRecord(record.medicalRecordID)} className="btn btn-warning fst-italic rounded-pill">
                Update Medical Record
              </button>
            </>
          )}
          

          <h4 className=" text-center mt-4">Tests</h4>
          <table className="table table-striped table-borderless table-hover ">
            <thead className='table-group-divider'>
              <tr>
                <th>Test Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {record.tests.map((test, idx) => (
                <tr key={`test-${test.testID || idx}`}>
                  <td>{test.testName}</td>
                  <td>{test.testPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className='text-center'>Prescriptions</h4>
          <table className="table table-striped table-borderless table-hover">
            <thead className='table-group-divider'>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Duration</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {record.prescriptions.map((prescription, idx) => (
                <tr key={`prescription-${prescription.medicationID || idx}`}>
                  <td>{prescription.medicationName}</td>
                  <td>{prescription.dosage}</td>
                  <td>{prescription.durationDays} days</td>
                  <td>{prescription.quantity || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {record.billingDetails && (
            <div className="mt-3">
              <h4 className='text-center'>Billing Details</h4>
              <table className="table table-striped table-borderless table-hover ">
                <thead className='table-group-divider'>
                  <tr>
                    <th>Billing ID</th>
                    <th>Consultation Fee</th>
                    <th>Total Test Price</th>
                    <th>Total Medications Price</th>
                    <th>Grand Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{record.billingDetails.billingID}</td>
                    <td>{record.billingDetails.consultationFee}</td>
                    <td>{record.billingDetails.totalTestsPrice}</td>
                    <td>{record.billingDetails.totalMedicationsPrice}</td>
                    <td>{record.billingDetails.grandTotal}</td>
                    <td>{record.billingDetails.status}</td>
                    <td>
                      {record.billingDetails.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateBilling(record.billingDetails.billingID)}
                          className="btn btn-success rounded-pill fst-italic"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        
        </div>
      ))}

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

export default MedicalRecords;
