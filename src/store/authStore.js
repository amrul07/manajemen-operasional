import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // 🔐 Ambil token LANGSUNG dari localStorage saat store dibuat
  token: localStorage.getItem('token'),
  isTokenReady: true, // ✅ langsung siap (tidak async)

  // 🔑 Simpan token saat login
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  // 🚪 Logout / token invalid
  clearAuth: () => {
    localStorage.removeItem('token');
    set({ token: null });
  }

}));

export default useAuthStore;







  // token: null,
  // isTokenReady: false, // Penanda bahwa proses membaca token dari cookie sudah selesai  // Penting agar request TIDAK jalan sebelum token siap

  // // Dipanggil saat aplikasi pertama kali dijalankan
  // // Tujuannya: mengambil token dari cookie dan memasukkannya ke store
  // initAuth: () => {
  //   const token = Cookies.get('token'); // Ambil token dari cookie browser

  //   // Simpan token ke store
  //   // Jika tidak ada token → null
  //   // Set isTokenReady = true agar app tahu token sudah dicek
  //   set({
  //     token: token || null,
  //     isTokenReady: true
  //   });
  // },

  // // Dipanggil saat login BERHASIL
  // // Satu-satunya tempat untuk menyimpan token
  // setToken: (token) => {
  //   Cookies.set('token', token, {
  //     // Simpan token ke cookie
  //     expires: 365, // expires: 365 → cookie bertahan 1 tahun
  //     path: '/', // path: '/' → bisa diakses di seluruh halaman
  //     sameSite: 'Lax' // sameSite: 'Lax' → aman tapi tidak mengganggu request norma
  //   });

  //   set({ token }); // Simpan token ke store (memory)   // Ini yang langsung dipakai oleh interceptor & loader
  // },

  // // Dipanggil saat:
  // // - logout
  // // - token benar-benar invalid (401 Unauthenticated)
  // clearAuth: () => {
  //   Cookies.remove('token', { path: '/' }); // Hapus token dari cookie browser
  //   set({ token: null });
  // }