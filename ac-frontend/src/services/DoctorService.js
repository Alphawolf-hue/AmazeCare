import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/Doctor";
export const getAllDoctors = async () => {
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const createDoctor = async (doctor) => {
  const response = await axios.post(BASE_URL, doctor, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const updateDoctor = async (id, doctor) => {
  const response = await axios.put(`${BASE_URL}/${id}`, doctor, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const searchDoctorBySpecialization = async (specialization) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params: { specialization },
  });
  return response.data;
};
