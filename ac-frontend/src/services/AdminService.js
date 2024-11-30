import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/Admin";

export const getAllDoctors = async () => {
  const response = await axios.get(`${BASE_URL}/doctors`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const getAllPatients = async () => {
  const response = await axios.get(`${BASE_URL}/patients`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const getAllAdmins = async () => {
  const response = await axios.get(`${BASE_URL}/admins`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
