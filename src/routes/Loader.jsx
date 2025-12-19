// import useAuthStore from '../store/authStore';
// import { redirect } from 'react-router-dom';

// export const authLoader = async () => {
//   const { isTokenReady, token } = useAuthStore.getState();

//   // ⏳ Tunggu token siap
//   if (!isTokenReady) {
//     await new Promise((r) => setTimeout(r, 0));
//   }

//   // jika token tidak ada maka pindah ke halaman login
//   if (!token) {
//     return redirect('/login');
//   }

//   return null;
// };


import { redirect } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const authLoader = () => {
  const token = useAuthStore.getState().token;

  // ❌ Tidak ada token → login
  if (!token) {
    return redirect('/login');
  }

  // ✅ Token ada → lanjut
  return null;
};
