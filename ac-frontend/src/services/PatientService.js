import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/Patient";

export const getPatientById = async (id) => {
  console.log(id);
  const response = await axios.get(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
