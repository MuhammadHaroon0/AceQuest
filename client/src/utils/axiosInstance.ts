import axios from "axios";
import { NavigateFunction } from "react-router-dom";

axios.defaults.withCredentials = true
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },

});

// Add a method to set up interceptors
export const setupAxiosInterceptors = (navigate: NavigateFunction, removeUser: () => void) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                removeUser()
                navigate("/login"); // Redirect to the login page
            }

            return Promise.reject(error);
        }
    );
};

export default axiosInstance;
