import axios from "axios";
const userid = sessionStorage.getItem("id");
export const API_BASE_URL = "https://api.damsdelhi.com";
const jwtToken = sessionStorage.getItem("jwt_token");
const jwtToken1 = sessionStorage.getItem("jwt_token1");
const getRandomToken = () => {
  const min = 1000000000;
  const max = 99999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const device_token = getRandomToken();
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`, // Set the base URL for all requests
  timeout: 30000, // Set the timeout for requests (in milliseconds)
  headers: {
    "Content-Type": "application/json", // Set default headers for all requests
    Authorization: `Bearer ${jwtToken == "undefined" ? jwtToken1 : jwtToken}`,
    stream_id: 1,
    user_id: userid ? userid : 4,
    Accept: "application/json",
  },
});

// Add request interceptor for handling requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add response interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with successful response data
    return response;
  },
  (error) => {
    //response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
