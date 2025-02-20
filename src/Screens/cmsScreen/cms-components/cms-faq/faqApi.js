import axios from "axios";
const getAuthToken = () => localStorage.getItem("authToken");

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllFaq = async () => {
  const response = await axios.get(`${BASE_URL}/faq`);
  return response.data;
};

export const getFaqById = async (id) => {
  const response = await axios.get(`${BASE_URL}/faq/${id}`);
  return response.data;
};

export const updateFaqById = async (id, data) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token is missing");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await axios.patch(`${BASE_URL}/faq/${id}`, data, { headers });
  return response.data;
};

export const addFaq = async (data) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token is missing");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await axios.post(`${BASE_URL}/faq`, data, { headers });
  return response.data;
};

export const deleteFaq = async (id) => {
  try {
      const token = getAuthToken();
      if (!token) throw new Error("Token is missing");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${BASE_URL}/faq/${id}`, { headers });
      return response.data;
  } catch (error) {
      console.error("Error while deleting content:", error.response?.data || error.message);
      throw error;
  }
};
