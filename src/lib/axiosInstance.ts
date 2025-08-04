import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor: Ensures Content-Type is set
axiosInstance.interceptors.request.use((config) => {
  config.headers["Content-Type"] =
    config.headers["Content-Type"] || "application/json";
  return config;
});

// Response Interceptor: Redirect on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // or your actual login route
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
