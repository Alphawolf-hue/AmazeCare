import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/Prescription";

export const getAllPrescriptions = async () => {
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
