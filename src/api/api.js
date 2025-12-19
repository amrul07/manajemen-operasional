import axios from 'axios';
import Cookies from 'js-cookie';
import useAuthStore from '../store/authStore';

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseUrl
});

/* ===========================
   REQUEST INTERCEPTOR
   Sisipkan token otomatis
=========================== */
// Menambahkan interceptor request ke axios instance
// Kode di sini akan dijalankan SETIAP KALI sebelum request dikirim
api.interceptors.request.use(
  async (config) => {
    const { isTokenReady, token } = useAuthStore.getState();
    // ⏳ Jika token BELUM siap (app baru load)
    // Kita TUNGGU sebentar agar initAuth() selesai
    // Ini mencegah request jalan sebelum token tersedia
    if (!isTokenReady) {
      await new Promise((r) => setTimeout(r, 0));
    }
    // Jika token tersedia
    // Tambahkan Authorization header ke request
    if (token) {
      config.headers = {
        ...config.headers, // pertahankan header lain
        Authorization: `Bearer ${token}` // inject token ke header
      };
    }

    return config;
  },
  // Jika terjadi error sebelum request dikirim
  // langsung lempar error ke pemanggil
  (error) => Promise.reject(error)
);

export default api;

/* ===========================
   RESPONSE INTERCEPTOR
   Tangani Unauthenticated
=========================== */
// Kode ini dijalankan SETELAH response diterima
api.interceptors.response.use(
  (response) => response, // Jika response sukses (status 2xx)  // langsung kembalikan response tanpa diubah
  (error) => {
    // Cek apakah:
    // 1. Status HTTP = 401 (Unauthorized)
    // 2. Pesan error mengandung kata "unauthenticated"
    if (error.response?.status === 401 && error.response?.data?.message?.toLowerCase().includes('unauthenticated')) {
      // Hapus token dari store dan cookie
      // Ini artinya token benar-benar tidak valid / expired
      useAuthStore.getState().clearAuth();
      window.location.replace('/login'); // Redirect paksa ke halaman login
    }
    // Lempar error ke pemanggil
    // Supaya halaman bisa tetap handle error jika perlu
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
