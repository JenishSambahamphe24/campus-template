import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllGallery = async () => {
    const response = await axios.get(`${BASE_URL}/gallery`);
    return response.data;
};

export const getGalleryById = async (id) => {
    const response = await axios.get(`${BASE_URL}/gallery/${id}`);
    return response.data;
};

export const updateGalleryById = async (id, data) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.patch(`${BASE_URL}/gallery/${id}`, data, {headers});
    return response.data;
};

export const addGallery = async (data) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${BASE_URL}/gallery`, data, {headers});
    return response.data;
};

export const deleteGallery = async (id) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${BASE_URL}/gallery/${id}`, {headers});
    return response.data;
};