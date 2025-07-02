// src/lib/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 5000,
  withCredentials: true,
});



export default axiosInstance;