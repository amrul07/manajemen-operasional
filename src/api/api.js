import axios from 'axios';
import useAuthStore from '../store/authStore';

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseUrl
});

// 🔐 REQUEST INTERCEPTOR
// Mendaftarkan interceptor request Axios
//  Code di dalamnya selalu dieksekusi sebelum request dikirim
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Mengambil token terbaru dari Zustand store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Menyisipkan token ke header HTTP // Format wajib untuk API berbasis Bearer Token
    }

    return config;
  },
  (error) => Promise.reject(error) // Jika terjadi error sebelum request terkirim → lempar error ke pemanggil
);

/* ===========================
   RESPONSE INTERCEPTOR
   Tangani Unauthenticated
=========================== */
// Mendaftarkan interceptor response Axios
api.interceptors.response.use(
  (response) => response,
  //   Mengecek kondisi khusus
  // Status 401 Unauthorized
  // Pesan backend mengandung kata Unauthenticated
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.message?.toLowerCase().includes('unauthenticated')) {
      useAuthStore.getState().clearAuth(); //Menghapus token dari: Zustand store,localStorage
      window.location.href = '/login'; // Redirect paksa ke halaman login
    }

    return Promise.reject(error); // Tetap lempar error ke pemanggil API
  }
);

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

export default api;
