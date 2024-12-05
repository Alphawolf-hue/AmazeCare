// /src/api/doctor/doctor.js
import axios from 'axios';

const API_URL = 'https://localhost:7270/api/Doctor';

// Create an Axios instance with the base URL and common headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept request to automatically add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all tests
export const getTests = async () => {
  try {
    const response = await axiosInstance.get(`/GetAllTests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
};

// Fetch all medications
export const getMedications = async () => {
  try {
    const response = await axiosInstance.get(`/GetAllMedications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};


export const conductConsultation = async (appointmentId, consultationFee, recordDto) => {
    try {
      const response = await axiosInstance.post(
        `/appointments/${appointmentId}/consult`,
        recordDto,
        {
          params: { consultationFee },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error conducting consultation:', error);
      throw error;
    }
  };

  export const getPatientMedicalRecords = async (patientId) => {
    try {
      const response = await axiosInstance.get(`/GetPatientMedicalRecords/${patientId}/medical-records`);
      return response.data;
    } catch (error) {
      console.error('Error in getPatientMedicalRecords:', error);
      throw error;
    }
  };

  export const updateMedicalRecord = async (recordId, patientId, updateDto) => {
    console.log('API Call - Update Medical Record:', {
      endpoint: `/UpdateMedicalRecord/${recordId}/${patientId}`,
      payload: updateDto,
    });
  
    try {
      const response = await axiosInstance.put(`/UpdateMedicalRecord/${recordId}/${patientId}`, updateDto);
      console.log('Response - Update Medical Record:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error - Update Medical Record:', error);
      throw error;
    }
  };

  // Update Billing Status API Call
export const updateBillingStatus = async (billingId) => {
  console.log('API Call - Update Billing Status:', {
    endpoint: `/billing/${billingId}/pay`,
  });

  try {
    const response = await axiosInstance.put(`/billing/${billingId}/pay`);
    console.log('Response - Update Billing Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error - Update Billing Status:', error);
    throw error;
  }
};


export const getALLSchedules = async () => {
  const response = await axiosInstance.get('/GetALLSchedules');
  return response.data;
};

export const createSchedule = async (scheduleData) => {
  const response = await axiosInstance.post('/CreateSchedule', scheduleData);
  return response.data;
};


export const updateSchedule = async (scheduleId, updatedData) => {
  const response = await axiosInstance.put(`/UpdateSchedule/${scheduleId}`, updatedData);
  return response.data;
};

export const cancelSchedule = async (scheduleId) => {
  const response = await axiosInstance.put(`/CancelSchedule/${scheduleId}`);
  return response.data;
};

export const markScheduleComplete = async (scheduleId) => {
  return axiosInstance.put(`/CompleteSchedules/${scheduleId}`);
};

export const getDoctorBills = async () => {
  try {
    const response = await axiosInstance.get(`/GetBills`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};
export const markBillAsPaid = async (billingId) => {
  try {
    const response = await axiosInstance.put(`/billing/${billingId}/pay`);
    return response.data;
  } catch (error) {
    console.error('Error marking bill as paid:', error);
    throw error;
  }
};
