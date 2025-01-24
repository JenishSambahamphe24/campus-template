import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllFeedbacks = async () => {
    const response = await axios.get(`${BASE_URL}/feedback`);
    return response.data;
};

export const addNewFeedback = async (data) => {
    const response = await axios.post(`${BASE_URL}/feedback`, data);
    return response.data;
};