import React, { useState, useEffect } from "react";
import {
  getDoctorSchedule,
  updateSchedule,
  cancelSchedule,
  markScheduleCompleted,
} from "../../api/admin/adminAPI";
import "bootstrap/dist/css/bootstrap.min.css";
import { GrSchedules } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";



const ManageDoctorSchedule = () => {
  const [doctorId, setDoctorId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [editScheduleId, setEditScheduleId] = useState(null);
  const [updatedDates, setUpdatedDates] = useState({ startDate: "", endDate: "" });
  const [alert, setAlert] = useState({ message: "", type: "", show: false });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5;

  const showAlert = (message, type) => {
    setAlert({ message, type, show: true });
    setTimeout(() => setAlert({ ...alert, show: false }), 2000);
  };

  const fetchSchedules = async () => {
    if (!doctorId) {
      showAlert("Please provide a valid Doctor ID.", "warning");
      return;
    }

    try {
      const data = await getDoctorSchedule(doctorId);
      if (data.length === 0) {
        showAlert("No schedules found for the provided Doctor ID.", "info");
      }
      setSchedules(data);
    } catch (error) {
      showAlert("Failed to fetch schedules. Please try again.", "danger");
    }
  };

  const handleUpdate = async (scheduleId) => {
    try {
      const schedule = schedules.find((s) => s.scheduleID === scheduleId);
      const payload = {
        startDate: updatedDates.startDate || schedule.startDate,
        endDate: updatedDates.endDate || schedule.endDate,
        status: "Scheduled",
      };
      await updateSchedule(scheduleId, payload);
      showAlert("Schedule updated successfully.", "success");
      setEditScheduleId(null);
      fetchSchedules();
    } catch (error) {
      showAlert("Failed to update schedule. Please try again.", "danger");
    }
  };

  const handleCancel = async (scheduleId) => {
    try {
      await cancelSchedule(scheduleId);
      showAlert("Schedule canceled successfully.", "success");
      fetchSchedules();
    } catch (error) {
      showAlert("Failed to cancel schedule. Please try again.", "danger");
    }
  };

  const handleMarkCompleted = async (scheduleId) => {
    try {
      await markScheduleCompleted(scheduleId);
      showAlert("Schedule marked as completed successfully.", "success");
      fetchSchedules();
    } catch (error) {
      showAlert("Failed to mark schedule as completed. Please try again.", "danger");
    }
  };

  const cancelEdit = () => {
    setEditScheduleId(null);
    setUpdatedDates({ startDate: "", endDate: "" });
    showAlert("Edit canceled.", "info");
  };

  const filteredSchedules = schedules.filter(
    (schedule) => filterStatus === "All" || schedule.status === filterStatus
  );

  useEffect(() => {
    setCurrentPage(1); 
  }, [filterStatus]);
 
  // Pagination logic
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = filteredSchedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );

  const totalPages = Math.ceil(filteredSchedules.length / schedulesPerPage);

  return (
    <div className="container min-vh-100 text-dark">
      <h2 className="my-4"><GrSchedules className="me-3"/>Manage Doctor Schedule</h2>

      {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
                  <hr class="border border-dark border-1 opacity-100"></hr>


      <div className="mb-4">
        <label htmlFor="doctorId" className="form-label h6 ">
          Enter Doctor ID:
        </label>
        <div className="d-flex">
          <input
            type="text"
            id="doctorId"
            className="form-control me-2 rounded-pill bg-light border-dark"
            placeholder="Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
          <button className="btn btn-dark text-light rounded-pill" onClick={fetchSchedules}>
            Search
          </button>
        </div>
      </div>


      <div className="mb-3">
        <button
          className={`btn btn-outline-dark rounded-pill me-2 ${filterStatus === "All" ? "active" : ""}`}
          onClick={() => setFilterStatus("All")}
        >
          All
        </button>
        <button
          className={`btn btn-outline-dark rounded-pill me-2 ${filterStatus === "Scheduled" ? "active" : ""}`}
          onClick={() => setFilterStatus("Scheduled")}
        >
          Scheduled
        </button>
        <button
          className={`btn btn-outline-dark rounded-pill me-2 ${filterStatus === "Completed" ? "active" : ""}`}
          onClick={() => setFilterStatus("Completed")}
        >
          Completed
        </button>
        <button
          className={`btn btn-outline-dark rounded-pill ${filterStatus === "Cancelled" ? "active" : ""}`}
          onClick={() => setFilterStatus("Cancelled")}
        >
          Cancelled
        </button>
      </div>

      {currentSchedules.length > 0 ? (
        <>
          <table className="table table-striped table-borderless table-hover table-responsive">
            <thead className="table-group-divider">
              <tr>
                <th>Schedule ID</th>
                <th>Doctor Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.map((schedule) => (
                <tr key={schedule.scheduleID}>
                  <td>{schedule.scheduleID}</td>
                  <td>{schedule.doctorName}</td>
                  <td>
                    {editScheduleId === schedule.scheduleID ? (
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={updatedDates.startDate}
                        onChange={(e) =>
                          setUpdatedDates({ ...updatedDates, startDate: e.target.value })
                        }
                      />
                    ) : (
                      formatDateTime(schedule.startDate)
                    )}
                  </td>
                  <td>
                    {editScheduleId === schedule.scheduleID ? (
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={updatedDates.endDate}
                        onChange={(e) =>
                          setUpdatedDates({ ...updatedDates, endDate: e.target.value })
                        }
                      />
                    ) : (
                      formatDateTime(schedule.endDate)
                    )}
                  </td>
                  <td>{schedule.status}</td>
                  <td>
                    {schedule.status === "Scheduled" ? (
                      editScheduleId === schedule.scheduleID ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2 rounded-pill fst-italic"
                            onClick={() => handleUpdate(schedule.scheduleID)}
                          >
                            Save
                          </button>
                          <button className="btn btn-danger btn-sm rounded-pill fst-italic" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-2 rounded-pill fst-italic"
                            onClick={() => setEditScheduleId(schedule.scheduleID)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger btn-sm me-2 rounded-pill fst-italic"
                            onClick={() => handleCancel(schedule.scheduleID)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-success btn-sm rounded-pill fst-italic"
                            onClick={() => handleMarkCompleted(schedule.scheduleID)}
                          >
                            Mark Completed
                          </button>
                        </>
                      )
                    ) : (
                      "No Actions"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr class="border border-dark border-1 opacity-100"></hr>

          <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fst-italic">
            Page {currentPage} of {totalPages}
          </span>
          <div>
            <button
              className="btn btn-outline-dark me-2 rounded-pill fst-italic"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-dark rounded-pill fst-italic"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        </>
      ) : (
        <p className="text-center fst-italic">No schedules available.</p>
      )}
    </div>
  );
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export default ManageDoctorSchedule;
