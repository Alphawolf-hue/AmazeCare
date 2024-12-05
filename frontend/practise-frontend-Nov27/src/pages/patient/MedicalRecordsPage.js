import React, { useEffect, useState } from 'react';
import { getMedicalHistory } from '../../api/patient/patientAPI';
import {FaNotesMedical } from 'react-icons/fa'

const MedicalRecordsPage = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrderAsc, setSortOrderAsc] = useState(true); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const data = await getMedicalHistory();
        setMedicalRecords(data);
        setFilteredRecords(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err || 'Failed to load medical records.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = medicalRecords.filter(
      (record) =>
        record.medicalRecordID.toString().includes(query) ||
        record.doctorName.toLowerCase().includes(query) ||
        record.symptoms.toLowerCase().includes(query) ||
        record.treatmentPlan.toLowerCase().includes(query)
    );

    setFilteredRecords(filtered);
    setCurrentPage(1); 
  };

  const handleSortToggle = () => {
    const newSortOrderAsc = !sortOrderAsc;
    setSortOrderAsc(newSortOrderAsc);

    const sortedRecords = [...filteredRecords].sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);

      return newSortOrderAsc ? dateA - dateB : dateB - dateA;
    });

    setFilteredRecords(sortedRecords);
  };

  // Pagination logic
  const recordsPerPage = 1; 
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(medicalRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Medical Records</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>Medical Records</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  return (
    <div className="container mt-4 text-dark min-vh-100">
      <h2 className="mb-4"><FaNotesMedical className='me-3'/>Medical Records</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {/* Search and Sort */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-75 text-dark bg-light border-dark rounded-pill"
          placeholder="Search by ID, Doctor Name, Symptoms, or Treatment Plan"
          value={searchQuery}
          onChange={handleSearch}
        />
         <button
          onClick={handleSortToggle}
          className="btn btn-outline-dark fst-italic rounded-pill"
          title={`Sort by Date (${sortOrderAsc ? 'Ascending' : 'Descending'})`}
        >
          Sort by Date {sortOrderAsc ? '↑' : '↓'}
        </button>
      </div>
      

      {currentRecords.length === 0 ? (
        <div className="alert alert-warning">No medical records found.</div>
      ) : (
        <>
          {currentRecords.map((record) => (
            <div key={record.medicalRecordID} className="mb-5">
              <h4 className='text-center'>Medical Records</h4>
              <table className="table table-borderless table-hover  table-striped">
                <tbody className='table-group-divider'>
                  <tr>
                    <th>Medical Record ID</th>
                    <td>{record.medicalRecordID}</td>
                  </tr>
                  <tr>
                    <th>Appointment Date</th>
                    <td>
                      {new Date(record.appointmentDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Doctor Name</th>
                    <td>{record.doctorName}</td>
                  </tr>
                  <tr>
                    <th>Symptoms</th>
                    <td>{record.symptoms}</td>
                  </tr>
                  <tr>
                    <th>Physical Examination</th>
                    <td>{record.physicalExamination}</td>
                  </tr>
                  <tr>
                    <th>Treatment Plan</th>
                    <td>{record.treatmentPlan}</td>
                  </tr>
                  <tr>
                    <th>Follow-Up Date</th>
                    <td>
                      {record.followUpDate
                        ? new Date(record.followUpDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tests */}
              <h5 className='text-center'>Tests</h5>
              {record.tests && record.tests.length > 0 ? (
                <table className="table table-borderles table-hover table-striped">
                  <thead className='table-group-divider'>
                    <tr>
                      <th>Test Name</th>
                      <th>Price ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.tests.map((test, index) => (
                      <tr key={index}>
                        <td>{test.testName}</td>
                        <td>{test.testPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info">No tests available.</div>
              )}

              {/* Prescriptions */}
              <h5 className='text-center'>Prescriptions</h5>
              {record.prescriptions && record.prescriptions.length > 0 ? (
                <table className="table table-bordereless table-hover table-striped">
                  <thead className='table-group-divider'>
                    <tr>
                      <th>Medication Name</th>
                      <th>Dosage</th>
                      <th>Duration (Days)</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.prescriptions.map((prescription, index) => (
                      <tr key={index}>
                        <td>{prescription.medicationName}</td>
                        <td>{prescription.dosage}</td>
                        <td>{prescription.durationDays}</td>
                        <td>{prescription.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info">No prescriptions available.</div>
              )}

              {/* Billing Details */}
              <h5 className='text-center'>Billing Details</h5>
              {record.billingDetails ? (
                <table className="table table-borderless table-hover table-striped">
                  <thead className='table-group-divider'>
                    <tr>
                      <th>Consultation Fee</th>
                      <th>Total Test Price</th>
                      <th>Total Medication Price</th>
                      <th>Grand Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{record.billingDetails.consultationFee}</td>
                      <td>{record.billingDetails.totalTestsPrice}</td>
                      <td>{record.billingDetails.totalMedicationsPrice}</td>
                      <td>{record.billingDetails.grandTotal}</td>
                      <td>{record.billingDetails.status}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info rounded-pill fst-italic">No billing details available.</div>
              )}
            </div>
          ))}
                <hr class="border border-dark border-1 opacity-100"></hr>


           {/* Pagination Controls */}
           {filteredRecords.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
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
          )}


        </>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
