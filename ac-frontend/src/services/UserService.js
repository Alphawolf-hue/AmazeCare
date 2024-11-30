import axios from 'axios';

const BASE_URL = "https://localhost:7183/api/User";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};

