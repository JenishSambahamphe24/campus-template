import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("authToken");


//  Faculties
export const getAllFaculties = async () => {
    const response = await axios.get(`${BASE_URL}/faculty`);
    return response.data;
};

export const getFacultyById = async (id) => {
    const response = await axios.get(`${BASE_URL}/faculty/${id}`);
    return response.data;
};

export const updateFacultyById = async (id, data) => {
    const token = getAuthToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.patch(`${BASE_URL}/faculty/${id}`, data, { headers });
    return response.data;
};

export const addFaculty = async (data) => {
    const token = getAuthToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${BASE_URL}/faculty`, data, { headers });
    return response.data;
};
export const deleteFacultyById = async (id) => {
    const token = getAuthToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${BASE_URL}/faculty/${id}`, { headers });
    return response.data;
};


// Programs
export const getAllPrograms = async () => {
    const response = await axios.get(`${BASE_URL}/program`);
    return response.data;
};

export const getProgramById = async (id) => {
    const response = await axios.get(`${BASE_URL}/program/${id}`);
    return response.data;
};

export const updateProgramById = async (id, data) => {
    const token = getAuthToken();
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.patch(`${BASE_URL}/program/${id}`, data, { headers });
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }


};

export const addProgram = async (data) => {
    const token = getAuthToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${BASE_URL}/program`, data, { headers });
    return response.data;
};

export const deleteProgram = async (id) => {
    const token = getAuthToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${BASE_URL}/program/${id}`, { headers });
    return response.data;
};


