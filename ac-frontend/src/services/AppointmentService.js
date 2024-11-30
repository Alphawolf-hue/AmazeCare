import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/Appointment";

export const getAllAppointments = async () => {
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
