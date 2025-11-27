import axios from "axios";

const getAuthToken = () => localStorage.getItem("authToken");
console.log(getAuthToken);
const BASE_URL = "http://192.168.0.104:5001/api/contacts";

// ------------------------ ADD ------------------------
export const addContactDetails = async (data) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");

    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      contactEmail1: data.contactEmail1,
      contactEmail2: data.contactEmail2 || null,
      phoneNo1: data.phoneNo1,
      phoneNo2: data.phoneNo2 || null,
      address: data.address || null,
      addressNepali: data.addressNepali || null,
      collegeName: data.collegeName || null,
      collegeNameNepali: data.collegeNameNepali || null,
    };

    const response = await axios.post(BASE_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error adding contact:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ------------------------ GET BY ID ------------------------
export const getContactDetailsById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// ------------------------ UPDATE ------------------------
export const updateContactDetailsById = async (id, data) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");

    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      contactEmail1: data.contactEmail1,
      contactEmail2: data.contactEmail2 || null,
      phoneNo1: data.phoneNo1,
      phoneNo2: data.phoneNo2 || null,
      address: data.address || null,
      addressNepali: data.addressNepali || null,
      collegeName: data.collegeName || null,
      collegeNameNepali: data.collegeNameNepali || null,
    };

    const response = await axios.patch(`${BASE_URL}/${id}`, payload, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error while updating contact:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ------------------------ DELETE ------------------------
export const deleteContactDetails = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");

    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.delete(`${BASE_URL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error while deleting contact:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ------------------------ GET ALL ------------------------
export const getAllContactDetails = async () => {
  const response = await axios.get(BASE_URL);
  
  return response.data;
};
