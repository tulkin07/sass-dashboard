import axios from "axios";

export const apiClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || "Request failed",
        status: error.response.status,
        original: error,
      });
    }
    if (error.request) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
        original: error,
      });
    }
    return Promise.reject({
      message: error.message || "Unknown error",
      status: -1,
      original: error,
    });
  }
);
