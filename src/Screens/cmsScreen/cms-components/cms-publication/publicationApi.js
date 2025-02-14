import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("authToken");


export const getAllpublication = async () => {
    const response = await axios.get(`${BASE_URL}/publication`);
    return response.data;
};
export const getPublicationById = async (id) => {
    const response = await axios.get(`${BASE_URL}/publication/${id}`);
    return response.data;
};
export const getPublicationByCategoryId = async (id) => {
    const response = await axios.get(`${BASE_URL}/publication/category/${id}`);
    return response.data;
};
export const updatePublicationById = async (id, data) => {
    try {
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axios.patch(`${BASE_URL}/publication/${id}`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error while updating Publication:", error.response?.data || error.message);
        throw error;
    }
};
export const addPublication = async (data) => {
    try {
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(`${BASE_URL}/publication`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error while adding Publication:", error.response?.data || error.message);
        throw error;
    }
};
export const deletePublication = async (id) => {
    try {
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.delete(`${BASE_URL}/publication/${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error("Error while deleting Publication:", error.response?.data || error.message);
        throw error;
    }
};


// publication category 

export const getPublicationCategory = async () => {
    const response = await axios.get(`${BASE_URL}/publicationCategories`);
    return response.data;
}

export const getPublicationCategoryById = async (id) => {
    const response = await axios.get(`${BASE_URL}/publicationCategories/${id}`);
    return response.data;
};

export const addPublicationCategory = async (data) => {
    try {
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(`${BASE_URL}/publicationCategories`, data, { headers })
        return response.data
    } catch (error) {
        console.error("Error while adding category:", error.response?.data || error.message);
        throw error;
    }

}

export const updatePublicationCategoryById = async (id, data) => {
    try {
        const token = getAuthToken();
        if (!token) throw new Error("Token is missing");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.patch(`${BASE_URL}/publicationCategories/${id}`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error while updating category:", error.response?.data || error.message);
        throw error;
    }
};


