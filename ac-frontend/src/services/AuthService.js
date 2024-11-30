import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/Auth";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};
