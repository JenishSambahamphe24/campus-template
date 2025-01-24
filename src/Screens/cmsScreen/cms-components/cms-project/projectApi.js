import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllProjects = async () => {
    const response = await axios.get(`${BASE_URL}/projects`);
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await axios.get(`${BASE_URL}/projects/${id}`);
    return response.data;
};

export const updateProjectById = async (id, data) => {
    const token = localStorage.getItem('authToken')
    console.log(token)
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.patch(`${BASE_URL}/projects/${id}`, data, { headers });
    return response.data;
};

export const addProject = async (data) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${BASE_URL}/projects`, data, { headers });
    return response.data;
};

export const deleteProject = async (id) => {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${BASE_URL}/projects/${id}`, { headers });
    return response.data;
}