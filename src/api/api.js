import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseUrl
});

//  get data
export const fetchData = async (endpoint) => {
  try {
    // Fetch data dari endpoint yang diberikan
    const response = await api.get(endpoint);

    // Mengembalikan data dari response
    return response.data;
  } catch (error) {
    // menangani error
    console.log('Error fetching data:', error);
    throw error;
  }
};

// Post Data / Create
export const postData = async (endpoint, data, token) => {
  try {
    // Set Authorization header dengan token jika diperlukan
    if (token) {
      setAuthHeader(token);
    }
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete data
export const deleteData = async (endpoint, token) => {
  try {
    // Set Authorization header dengan token
    // setAuthHeader(token);
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};
