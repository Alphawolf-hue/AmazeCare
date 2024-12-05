import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getALLSchedules,createSchedule,updateSchedule,cancelSchedule,markScheduleComplete } from '../../api/doctor/doctor';
import { GrSchedules } from "react-icons/gr";


const Schedule = () => {
  const [Schedule, setSchedule] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [newSchedule, setNewSchedule] = useState({ startDate: '', endDate: '' });
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editScheduleDates, setEditScheduleDates] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  const fetchSchedules = async (optionalMessage = null, alertType = 'success', isInitialLoad = false) => {
    try {
      const fetchedSchedules = await getALLSchedules();
      setSchedule(fetchedSchedules);

      if (!isInitialLoad && optionalMessage) {
        showAlert(optionalMessage, alertType);
      }
    } catch (error) {
      showAlert(error.response?.data || 'Error fetching Schedule', 'danger');
    }
  };

  const handleCreateSchedule = async () => {
    if (!newSchedule.startDate || !newSchedule.endDate) {
      showAlert('Please provide both start and end date and time.', 'warning');
      return;
    }

    try {
      await createSchedule(newSchedule);
      setNewSchedule({ startDate: '', endDate: '' });
      fetchSchedules('Schedule created successfully.', 'success');
    } catch (error) {
      showAlert(error.response?.data || 'Error creating Schedule', 'danger');
    }
  };

  const handleCancelSchedule = async (scheduleId) => {
    try {
      const response = await cancelSchedule(scheduleId);
      fetchSchedules(response || 'Schedule cancelled successfully.', 'success');
    } catch (error) {
      showAlert(error.response?.data || 'Error cancelling Schedule', 'danger');
    }
  };

  const handleReschedule = async (scheduleId) => {
    try {
      const updatedDates = editScheduleDates[scheduleId] || {};
      const payload = {
        startDate: updatedDates.startDate || Schedule.find((h) => h.scheduleID === scheduleId).startDate,
        endDate: updatedDates.endDate || Schedule.find((h) => h.scheduleID === scheduleId).endDate,
        status: 'Scheduled',
      };

      await updateSchedule(scheduleId, payload);
      setEditingScheduleId(null);
      setEditScheduleDates({});
      fetchSchedules('Schedule updated successfully.', 'success');
    } catch (error) {
      showAlert(error.response?.data || 'Error rescheduling ', 'danger');
    }
  };
  const handleMarkComplete = async (scheduleId) => {
    try {
      const response = await markScheduleComplete(scheduleId);
      fetchSchedules(response.data || 'Marked Completed successfully.', 'success');
    } catch (error) {
      showAlert(error.response?.data || 'Error marking schedule as completed.', 'danger');
    }
  };

  const filteredSchedule = Schedule.filter((schedule) =>
    statusFilter ? schedule.status === statusFilter : true
  );
  const totalPages = Math.ceil(filteredSchedule.length / entriesPerPage);

  const displayedSchedules = filteredSchedule.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [statusFilter]);
  
  useEffect(() => {
    fetchSchedules(null, null, true);
  }, []);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container min-vh-100">
      <h2 className="my-4 text-dark "><GrSchedules className='me-3' />  Manage Schedule</h2>
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

      <div className="mb-4">
        <h5 className='text-dark'>Create New Schedule</h5>
        <div className="row g-2">
          <div className="col-md-5">
            <input
              type="datetime-local"
              className="form-control border-dark text-dark bg-light rounded-pill"
              value={newSchedule.startDate}
              onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
            />
          </div>
          <div className="col-md-5">
            <input
              type="datetime-local"
              className="form-control text-dark border-dark text-dark bg-light rounded-pill"
              value={newSchedule.endDate}
              onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-dark text-light w-100 fst-italic rounded-pill" onClick={handleCreateSchedule}>
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h5 className='text-dark'>Filter Schedule</h5>
        <div className="btn-group">
          <button className={`btn btn-outline-dark rounded-pill me-2 ${!statusFilter ? 'active' : ''}`} onClick={() => setStatusFilter('')}>
            All
          </button>
          <button className={`btn btn-outline-dark rounded-pill me-2 ${statusFilter === 'Scheduled' ? 'active' : ''}`} onClick={() => setStatusFilter('Scheduled')}>
            Scheduled
          </button>
          <button className={`btn btn-outline-dark rounded-pill me-2 ${statusFilter === 'Cancelled' ? 'active' : ''}`} onClick={() => setStatusFilter('Cancelled')}>
            Cancelled
          </button>
          <button className={`btn btn-outline-dark rounded-pill me-2 ${statusFilter === 'Completed' ? 'active' : ''}`} onClick={() => setStatusFilter('Completed')}>
            Completed
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-borderless">
          <thead className='table-group-divider '>
            <tr>
              <th className='text-dark'>ID</th>
              <th className='text-dark'>Start Date & Time</th>
              <th className='text-dark'>End Date & Time</th>
              <th className='text-dark'>Status</th>
              <th className='text-dark'>Actions</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {displayedSchedules.map((schedule) => (
              <tr key={schedule.scheduleID}>
                <td className='text-dark'>{schedule.scheduleID}</td>
                <td className='text-dark'>
                  {editingScheduleId === schedule.scheduleID ? (
                    <input
                      type="datetime-local"
                      defaultValue={new Date(schedule.startDate).toISOString().slice(0, 16)}
                      className="form-control"
                      onChange={(e) =>
                        setEditScheduleDates({
                          ...editScheduleDates,
                          [schedule.scheduleID]: {
                            ...(editScheduleDates[schedule.scheduleID] || {}),
                            startDate: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    formatDateTime(schedule.startDate)
                  )}
                </td>
                <td className='text-dark'>
                  {editingScheduleId === schedule.scheduleID ? (
                    <input
                      type="datetime-local"
                      defaultValue={new Date(schedule.endDate).toISOString().slice(0, 16)}
                      className="form-control"
                      onChange={(e) =>
                        setEditScheduleDates({
                          ...editScheduleDates,
                          [schedule.scheduleID]: {
                            ...(editScheduleDates[schedule.scheduleID] || {}),
                            endDate: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    formatDateTime(schedule.endDate)
                  )}
                </td>
                <td className='text-dark'>{schedule.status}</td>
                <td className='text-dark'>
                  {schedule.status === 'Scheduled' && (
                    <>
                     <button className="btn btn-success btn-sm me-2 fst-italic rounded-pill"
                         onClick={() => handleMarkComplete(schedule.scheduleID)}>
                          Mark Complete
                      </button>
                    
                      {editingScheduleId === schedule.scheduleID ? (
                        <button className="btn btn-primary btn-sm me-2 fst-italic rounded-pill" onClick={() => handleReschedule(schedule.scheduleID)}>
                          Save
                        </button>
                      ) : (
                        <button className="btn btn-warning btn-sm me-2 fst-italic rounded-pill" onClick={() => setEditingScheduleId(schedule.scheduleID)}>
                          Reschedule
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm fst-italic rounded-pill" onClick={() => handleCancelSchedule(schedule.scheduleID)}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default Schedule;
