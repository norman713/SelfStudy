import axios, { AxiosInstance } from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Bật để gửi credentials (cookies, authorization headers)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request Origin:", config.url, "with Credentials:", config.withCredentials);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;