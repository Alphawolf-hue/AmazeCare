import React, { useState, useEffect } from 'react';
import { getDoctorBills, markBillAsPaid } from '../../api/doctor/doctor';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HiClipboardDocumentList } from "react-icons/hi2";


const DoctorBilling = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;
  // Show alert message
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 2000);
  };

  // Fetch all bills
  const fetchBills = async () => {
    try {
      const fetchedBills = await getDoctorBills();
      setBills(fetchedBills);
      setFilteredBills(fetchedBills); // Initialize filtered bills
    } catch (error) {
      showAlert(error.response?.data || 'Error fetching bills.', 'danger');
    }
  };

  // Handle marking a bill as paid
  const handleMarkPaid = async (billingId) => {
    try {
      const response = await markBillAsPaid(billingId);
      showAlert(response, 'success');
      fetchBills(); // Refresh the bill list
    } catch (error) {
      showAlert(error.response?.data || 'Error updating bill status.', 'danger');
    }
  };

  // Filter bills based on status and search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = bills.filter((bill) => {
      const matchesStatus = statusFilter ? bill.status === statusFilter : true;
      const matchesSearch = bill.patientName.toLowerCase().includes(lowercasedQuery);
      return matchesStatus && matchesSearch;
    });
    setFilteredBills(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, bills]);

  const totalPages = Math.ceil(filteredBills.length / entriesPerPage);
  const displayedBills = filteredBills.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="container text-dark min-vh-100">
      <h2 className="my-4"><HiClipboardDocumentList className='me-3'/>Manage Billing</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setAlert({ message: '', type: '' })}
          ></button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control text-dark bg-light border-dark rounded-pill"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <div className="btn-group">
            <button
              className={`btn btn-outline-dark rounded-pill me-2 ${!statusFilter ? 'active' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              All
            </button>
            <button
              className={`btn btn-outline-dark rounded-pill me-2 ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending
            </button>
            <button
              className={`btn btn-outline-dark rounded-pill me-2 ${statusFilter === 'Paid' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Paid')}
            >
              Paid
            </button>
          </div>
        </div>
      </div>

      {/* Billing Table */}
      <div className="table-responsive">
        <table className="table table-striped table-borderless table-hover">
          <thead className='table-group-divider'>
            <tr>
              <th>BillingID</th>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Consultation Fee</th>
              <th>Total Tests Price</th>
              <th>Total Medications Price</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {displayedBills.length > 0 ? (
              displayedBills.map((bill) => (
                <tr key={bill.billingID}>
                  <td>{bill.billingID}</td>
                  <td>{bill.patientID}</td>
                  <td>{bill.patientName}</td>
                  <td>{bill.consultationFee.toFixed(2)}</td>
                  <td>{bill.totalTestsPrice.toFixed(2)}</td>
                  <td>{bill.totalMedicationsPrice.toFixed(2)}</td>
                  <td>{bill.grandTotal.toFixed(2)}</td>
                  <td>{bill.status}</td>
                  <td>
                    {bill.status === 'Pending' && (
                      <button
                        className="btn btn-success btn-sm fst-italic rounded-pill"
                        onClick={() => handleMarkPaid(bill.billingID)}
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {/* <nav>
        <ul className="pagination justify-content-center">
          {[...Array(totalPages).keys()].map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav> */}

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

export default DoctorBilling;
