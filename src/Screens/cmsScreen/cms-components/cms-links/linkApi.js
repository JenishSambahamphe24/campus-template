import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('authToken') 

export const getAllLink = async () => {
    const response = await axios.get(`${BASE_URL}/application`);
    return response.data;
};

export const getLinkById = async (id) => {
    const response = await axios.get(`${BASE_URL}/application/${id}`);
    return response.data;
};

export const updateLinkById = async (id, data) => {
    const headers = {
        'Authorization': `Bearer ${token}`
      };
  
    const response = await axios.patch(`${BASE_URL}/application/${id}`, data, {headers});
    return response.data;
};

export const addLink = async (data) => {
    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        const response = await axios.post(`${BASE_URL}/application`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error in addLink:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteLink = async (id) => {
    const headers = {
        'Authorization': `Bearer ${token}`
      };
    const response = await axios.delete(`${BASE_URL}/application/${id}`, {headers});
    return response.data;
};
