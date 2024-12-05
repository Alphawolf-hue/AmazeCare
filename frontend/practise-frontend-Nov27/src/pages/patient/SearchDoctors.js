import React, { useState, useEffect } from 'react';
import { getDoctorsBySpecialization } from '../../api/patient/patientAPI';
import {FaSearch} from 'react-icons/fa'

const specializations = [
  'All',
  'Cardiology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'General Medicine',
];

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page

  const fetchDoctors = async (specialization = null) => {
    setLoading(true);
    setError('');
    try {
      const data = await getDoctorsBySpecialization(specialization);
      console.log('API Response:', data); // Log API response for debugging
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err || 'Failed to fetch doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(); // Fetch all doctors on component mount
  }, []);

  useEffect(() => {
    // Apply search filter
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = doctors.filter(
      (doctor) =>
        doctor.fullName.toLowerCase().includes(lowerSearchTerm) ||
        doctor.designation.toLowerCase().includes(lowerSearchTerm) ||
        doctor.qualification.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page after search
  }, [searchTerm, doctors]);

  const handleFilterClick = (specialization) => {
    setActiveFilter(specialization);
    fetchDoctors(specialization === 'All' ? null : specialization);
  };

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);


  return (
    <div className="container mt-4 text-dark min-vh-100">
      <h2 className="mb-4"><FaSearch className='me-3'/>Search Doctors</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {/* Filter Buttons */}
      <div className="mb-3">
        {specializations.map((specialization) => (
          <button
            key={specialization}
            className={`btn rounded-pill fst-italic ${
              activeFilter === specialization ? 'btn-dark' : 'btn-outline-dark'
            } me-2 mb-2`}
            onClick={() => handleFilterClick(specialization)}
          >
            {specialization}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control text-dark bg-light border-dark rounded-pill"
          placeholder="Search by name, designation, or qualification"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading Spinner */}
      {loading && <div className="spinner-border text-primary" role="status"></div>}

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Doctors Table */}
      <div className='table-responsive '>
      {!loading && !error && doctors.length > 0 && (
        <table className=" table table-striped table-hover table-borderless">
          <thead className='table-group-divider'>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Qualification</th>
              <th>Designation</th>
              <th>Specializations</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.map((doctor, index) => (
              <tr key={doctor.doctorID} className={index % 2 === 0 ? 'table-light' : 'table-secondary'}>
                <td>{doctor.doctorID}</td>
                <td>{doctor.fullName}</td>
                <td>{doctor.email}</td>
                <td>{doctor.experienceYears} years</td>
                <td>{doctor.qualification}</td>
                <td>{doctor.designation}</td>
                <td>{doctor.specializations.join(', ') || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

      {!loading && !error && doctors.length === 0 && (
        <div className="alert alert-warning">No doctors found.</div>
      )}
      <hr class="border border-dark border-1 opacity-100"></hr>

            {/* Pagination */}
            {!loading && filteredDoctors.length > 0 && (
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
      )}

    </div>
  );
};

export default SearchDoctors;
