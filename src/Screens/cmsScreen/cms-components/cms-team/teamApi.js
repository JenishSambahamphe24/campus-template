import axios from "axios";

const getAuthToken = () => localStorage.getItem("authToken");

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllTeams = async () => {
  const response = await axios.get(`${BASE_URL}/teams`);
  return response.data;
};

export const getTeamById = async (id) => {
  const response = await axios.get(`${BASE_URL}/teams/${id}`);
  return response.data;
};

export const updateTeamById = async (id, data) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.patch(`${BASE_URL}/teams/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error while updating team:", error.response?.data || error.message);
    throw error;
  }
};

export const addTeam = async (data) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(`${BASE_URL}/teams`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error while adding team:", error.response?.data || error.message);
    throw error;
  }

};

export const deleteTeam = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.delete(`${BASE_URL}/teams/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error while deleting team:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  const response = await axios.post(`${BASE_URL}/admin/users`);
  return response.data;
};

