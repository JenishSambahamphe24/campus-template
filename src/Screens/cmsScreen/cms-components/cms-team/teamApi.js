import axios from "axios";

const token = localStorage.getItem('authToken')

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
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  const response = await axios.patch(`${BASE_URL}/teams/${id}`, data, { headers });
  return response.data;
};

export const addTeam = async (data) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  const response = await axios.post(`${BASE_URL}/teams`, data, { headers });
  return response.data;
};
export const deleteTeam = async (id) => {
  const token = localStorage.getItem('authToken')
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  const response = await axios.delete(`${BASE_URL}/teams/${id}`, {headers});
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.post(`${BASE_URL}/admin/users`);
  return response.data;
};

