import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('authToken') 

export const getAllFaq = async () => {
    const response = await axios.get(`${BASE_URL}/faq`);
    return response.data;
};

export const getFaqById = async (id) => {
    const response = await axios.get(`${BASE_URL}/faq/${id}`);
    return response.data;
};

export const updateFaqById = async (id, data) => {
    const headers = {
        'Authorization': `Bearer ${token}`
      };
    const response = await axios.patch(`${BASE_URL}/faq/${id}`, data, {headers});
    return response.data;
};

export const addFaq = async (data) => {
    const headers = {
        'Authorization': `Bearer ${token}`
      };
    const response = await axios.post(`${BASE_URL}/faq`, data, {headers});
    return response.data;
};
