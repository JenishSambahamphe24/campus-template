import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllTestimonials = async () => {
    const response = await axios.get(`${BASE_URL}/testimonials`);
    return response.data;
};

export const getTestimonialById = async (id) => {
    const response = await axios.get(`${BASE_URL}/testimonials/${id}`);
    return response.data;
};

export const updateTestimonialById = async (id, data) => {
    const token = localStorage.getItem('authToken')
    console.log(token)
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.patch(`${BASE_URL}/testimonials/${id}`, data, { headers });
    return response.data;
};

export const addTestimonial = async (data) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${BASE_URL}/testimonials`, data, { headers });
    return response.data;
};

export const deleteTestimonial = async (id) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${BASE_URL}/testimonials/${id}`, { headers });
    return response.data;
}