import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const sendApiRequest = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const config = {
    method,
    url,
    headers,
  };
  if (data && method.toLowerCase() !== 'delete') {
    config.data = data;
  }
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'An error occurred' };
  }
};

export { sendApiRequest };