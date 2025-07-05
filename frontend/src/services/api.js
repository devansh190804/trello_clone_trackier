import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

const sendApiRequest = async (method, url, data = null) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'An error occurred' };
  }
};

export { sendApiRequest };