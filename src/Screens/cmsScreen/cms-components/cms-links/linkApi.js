import axios from "axios";
const getAuthToken = () => localStorage.getItem("authToken");

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllLink = async () => {
    const response = await axios.get(`${BASE_URL}/application`);
    return response.data;
};

export const getLinkById = async (id) => {
    const response = await axios.get(`${BASE_URL}/application/${id}`);
    return response.data;
};

export const updateLinkById = async (id, data) => {
    try{
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.patch(`${BASE_URL}/application/${id}`, data, {headers});
        return response.data;
    } catch (error) {
        console.error("Error in addLink:", error.response?.data || error.message);
        throw error;
    }
};

export const addLink = async (data) => {
    try {
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(`${BASE_URL}/application`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error in addLink:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteLink = async (id) => {
    try{
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.delete(`${BASE_URL}/application/${id}`, {headers});
        return response.data;
    } catch (error){
        console.error("Error while deleting Link", error.response?.data || error.message);
        throw error;
    }
};
