import axios from "axios";
const getAuthToken = () => localStorage.getItem("authToken");

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
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.patch(`${BASE_URL}/gallery/${id}`, data, {headers});
    return response.data;
};

export const addGallery = async (data) => {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(`${BASE_URL}/gallery`, data, {headers});
    return response.data;
};

export const addMultipleImage = async (id,data) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token is missing");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await axios.post(`${BASE_URL}/gallery/images/${id}`, data, {headers});
  return response.data;
};

export const deleteImageOfGallery = async (id) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token is missing");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await axios.delete(`${BASE_URL}/gallery/images/${id}`, {headers});
  return response.data;
};

export const deleteGallery = async (id) => {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.delete(`${BASE_URL}/gallery/${id}`, {headers});
    return response.data;
};