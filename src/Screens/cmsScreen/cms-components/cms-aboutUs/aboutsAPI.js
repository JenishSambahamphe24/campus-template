import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllaboutUs = async () => {
    const response = await axios.get(`${BASE_URL}/aboutUs`);
    return response.data;
};

export const getAboutUsById = async (id) => {
    const response = await axios.get(`${BASE_URL}/aboutUs/${id}`);
    return response.data;
};

export const updateAboutUsById = async (id, data) => {
    try {
        const token = localStorage.getItem('authToken')
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.patch(`${BASE_URL}/aboutUs/${id}`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error while updating:", error.response?.data || error.message);
        throw error;
    }

};

export const addAboutUs = async (data) => {
    try {
        const token = localStorage.getItem('authToken')
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.post(`${BASE_URL}/aboutUs`, data, { headers });
        return response.data;

    } catch (error) {
        console.log(error)
        throw error;
    }
};
