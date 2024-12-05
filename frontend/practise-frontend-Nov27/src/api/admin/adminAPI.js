// src/api/admin/adminAPI.js

import axios from 'axios';

const API_URL = 'https://localhost:7270/api/Admin';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error Response:', error.response);
    return Promise.reject(error);
  }
);

export const checkUsernameAvailability = async (username) => {
  const response = await axiosInstance.get(`/CheckUsername?username=${username}`);
  return response.data;
};

export const getAllSpecializations = async () => {
  const response = await axiosInstance.get('/specializations');
  return response.data;
};

export const registerDoctor = async (doctorData) => {
  const response = await axiosInstance.post('/RegisterDoctor', doctorData);
  return response.data;
};


export const getDoctorDetails = async (doctorId) => {
  const response = await axiosInstance.get(`GetDoctorDetails/${doctorId}`);
  return response.data;
};

export const updateDoctor = async (doctorId, doctorDto) => {
  const response = await axiosInstance.put(`UpdateDoctor/${doctorId}`, doctorDto);
  return response.data;
};

export const deleteDoctor = async (userId, doctorId) => {
  const response = await axiosInstance.delete(`DeleteDoctor/${userId}/${doctorId}`);
  return response.data;
};

// Function to fetch patient details by ID
export const getPatientDetails = async (patientId) => {
    try {
      const response = await axiosInstance.get(`/GetPatientDetails/${patientId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error fetching patient details.');
    }
  };
  
  // Function to update a patient
  export const updatePatient = async (patientDto) => {
    try {
      const response = await axiosInstance.post('/UpdatePatient', patientDto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error updating patient.');
    }
  };
  
  // Function to delete a patient by userId and patientId
  export const deletePatient = async (userId, patientId) => {
    try {
      const response = await axiosInstance.delete(`/DeletePatient/${userId}/${patientId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error deleting patient.');
    }
  };

export const registerAdmin = async (data) => {
  const response = await axiosInstance.post("/RegisterAdmin", data);
  return response.data;
};


// export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
//   const response = await axiosInstance.put(
//     `/RescheduleAppointment/${appointmentId}`,
//     rescheduleData
//   );
//   return response.data;
// };
export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
  console.log(`API Call: Rescheduling Appointment with ID ${appointmentId}`);
  console.log("Payload:", rescheduleData);
  return await axiosInstance.put(`/admin/RescheduleAppointment/${appointmentId}`, rescheduleData);
};

export const getAppointmentDetails = async (appointmentId) => {
  const response = await axiosInstance.get(`/ViewAppointmentDetails/${appointmentId}`);
  return response.data;
};


// // Function to fetch doctor schedules
// export const getDoctorSchedules = async (doctorId) => {
//   try {
//     const response = await axiosInstance.get(`/DoctorSchedule/GetAll/${doctorId}`);
//     console.log('Fetched Doctor Schedules:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching doctor schedules:', error);
//     throw error;
//   }
// };

// // Function to update a schedule
// export const updateSchedule = async (scheduleId, updatedData) => {
//   try {
//     const response = await axiosInstance.put(`/DoctorSchedule/Update/${scheduleId}`, updatedData);
//     console.log('Updated Schedule:', { scheduleId, updatedData, response: response.data });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating schedule:', error);
//     throw error;
//   }
// };

// // Function to cancel a schedule
// export const cancelSchedule = async (scheduleId) => {
//   try {
//     const response = await axiosInstance.put(`/DoctorSchedule/${scheduleId}/cancel`);
//     console.log('Canceled Schedule:', { scheduleId, response: response.data });
//     return response.data;
//   } catch (error) {
//     console.error('Error canceling schedule:', error);
//     throw error;
//   }
// };

// // Function to mark a schedule as completed
// export const markAsCompleted = async (scheduleId) => {
//   try {
//     const response = await axiosInstance.put(`/DoctorSchedule/${scheduleId}/completed`);
//     console.log('Completed Schedule:', { scheduleId, response: response.data });
//     return response.data;
//   } catch (error) {
//     console.error('Error marking schedule as completed:', error);
//     throw error;
//   }
// };


export const getDoctorSchedule = async (doctorId) => {
  const response = await axiosInstance.get(`/DoctorSchedule/GetAll/${doctorId}`);
  console.log("Fetched Schedules:", response.data);
  return response.data;
};

export const updateSchedule = async (scheduleId, updateData) => {
  const response = await axiosInstance.put(`/DoctorSchedule/Update/${scheduleId}`, updateData);
  console.log(response)
  return response.data;
};

export const cancelSchedule = async (scheduleId) => {
  const response = await axiosInstance.put(`/DoctorSchedule/${scheduleId}/cancel`);
  return response.data;
};

export const markScheduleCompleted = async (scheduleId) => {
  const response = await axiosInstance.put(`/DoctorSchedule/${scheduleId}/completed`);
  return response.data;
};


// API to fetch billing details
export const getBillingDetails = async () => {
  try {
    const response = await axiosInstance.get('/GetAllBilling');
    console.log('Billing details fetched:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching billing details:', error);
    throw error;
  }
};

// API to mark a bill as paid
export const markBillAsPaid = async (billingId) => {
  try {
    const response = await axiosInstance.put(`/Billing/${billingId}/pay`);
    console.log(`Marked bill ID ${billingId} as paid.`, response.data);
    return response;
  } catch (error) {
    console.error(`Error marking bill ID ${billingId} as paid:`, error);
    throw error;
  }
};


export const getAllMedications = async () => {
  return axiosInstance.get('/GetAllMedications');
};

export const addMedication = async (medication) => {
  return axiosInstance.post('/AddMedications', medication);
};

export const updateMedication = async (medicationId, medication) => {
  return axiosInstance.put(`/UpdateMedications/${medicationId}`, medication);
};

export const getAllTests = async () => {
  return axiosInstance.get('/GetAllTests');
};

export const addTest = async (test) => {
  return axiosInstance.post('/AddTests', test);
};

export const updateTest = async (testId, test) => {
  return axiosInstance.put(`/UpdateTests/${testId}`, test);
};
