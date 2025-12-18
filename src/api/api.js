import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseUrl
});

/* ===========================
   REQUEST INTERCEPTOR
   Sisipkan token otomatis
=========================== */
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
   Tangani Unauthenticated
=========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message === 'Unauthenticated.') {
      Cookies.remove('token');
      window.location.href = '/login'; // ✅ BENAR
    }
    return Promise.reject(error);
  }
);

// // Set Authorization header secara global
// const setAuthHeader = (token) => {
//   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// };

//  get data
export const fetchData = async (endpoint, token) => {
  try {
    // Set Authorization header dengan token yang diberikan
    // setAuthHeader(token);

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
      // setAuthHeader(token);
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

// logout
export const logout = async (endpoint, token) => {
  try {
    // Set Authorization header dengan token
    // setAuthHeader(token);
    const response = await api.post(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
