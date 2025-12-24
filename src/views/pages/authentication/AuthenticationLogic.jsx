import React, { useEffect, useRef, useState } from 'react';
import { logout, postData } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import useGlobalStore from '../../../store/globalStore';

export default function UseAuthenticationLogic() {
  const { setToken } = useAuthStore.getState();
  const setUser = useGlobalStore((state) => state.setUser);
  const router = useNavigate();
  const [data, setData] = useState({ no_hp: '', password: '' });
  const [verifikasi, setVerifikasi] = useState({ whatsapp: '', otp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    succes: false,
    message: ''
  });
  const verifikasi_no_hp = localStorage.getItem(`whatsapp`);
  // verifikasi otp
  const length = 6; // panjang karakter otp
  const [activeIndex, setActiveIndex] = useState(0); // Index input OTP yang sedang aktif (untuk border biru)
  const hiddenRef = useRef(null); // Ref ke input tersembunyi (hidden input)
  const [shake, setShake] = useState(false); // Untuk animasi shake ketika OTP salah
  const [timer, setTimer] = useState(300); // Countdown timer (detik)
  const [canResend, setCanResend] = useState(false); // Apakah tombol resend sudah boleh diklik
  const [succesOtp, setSuccesOtp] = useState(false); // Untuk menampilkan status sukses
  // perbarui password
  const [newPassword, setNewPassword] = useState({ password: '', password_confirmation: '' });
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [successPerbaruiPassword, setSuccessPerbaruiPassword] = useState(false); // Untuk menampilkan status sukses

  // Effect untuk countdown timer (verifikasi otp)
  useEffect(() => {
    // Jika timer > 0, buat interval 1 detik
    const t = timer > 0 && setInterval(() => setTimer((s) => s - 1), 1000);

    // Jika timer habis, aktifkan tombol resend
    if (timer === 0) setCanResend(true);

    // Cleanup interval agar tidak menumpuk
    return () => clearInterval(t);
  }, [timer]);

  //   ketika tombol login di klik
  const loginHandler = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      //initialize formData
      const formData = new FormData();

      //append data to formData
      formData.append('no_hp', data.no_hp);
      formData.append('password', data.password);

      //send data to server
      const res = await postData(`/login`, formData);

      console.log(res, 'respon');
      // set role user login
      setUser(res.jabatan);

      //set token
      setToken(res.token);

      //redirect to dashboard
      router('/dashboard/default');
    } catch (error) {
      console.error('Gagal Login:', error);
      let pesanError = 'Terjadi kesalahan saat login';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar((prev) => ({ ...prev, open: true, message: pesanError }));
    } finally {
      setLoading(false);
      setData({ no_hp: '', password: '' });
    }
  };

  // handle logout
  const handleLogout = async () => {
    try {
      await logout('/logout');
    } catch (e) {
      // abaikan error logout
    } finally {
      useAuthStore.getState().clearAuth();
      router('/login');
    }
  };

  // ketika lupa password di klik
  const handleLupaPassword = () => {
    router(`/verifikasi-noHp`);
    setSuccessPerbaruiPassword(false);
    setSuccesOtp(false);
  };

  // verifikasi no hp handle
  const handleVerifikasiWa = async () => {
    setLoading(true);
    try {
      const noHp = verifikasi.whatsapp || localStorage.getItem('whatsapp');
      //initialize formData
      const formData = new FormData();

      //append data to formData
      formData.append('whatsapp', noHp);
      const res = await postData(`/forgot-password/send-otp`, formData);

      localStorage.setItem('whatsapp', verifikasi.whatsapp); // simpan nomor hp ke local storage

      // console.log(res, 'verifikasi no hp');
      router(`/verifikasi-otp`);

      // kirim ulang otp
      // Jika belum boleh resend, hentikan
      if (!canResend) return;

      // Reset timer
      setTimer(300);
      setCanResend(false);
    } catch (error) {
      console.error('Gagal verifikasi nomor hp:', error);
      let pesanError = 'Terjadi kesalahan saat verifikasi nomor hp';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar((prev) => ({ ...prev, open: true, message: pesanError }));
    } finally {
      setLoading(false);
    }
  };

  // handel verifikasi otp
  const VerifikasiOtp = async () => {
    setLoading(true);
    try {
      //initialize formData
      const formData = new FormData();

      //append data to formData
      formData.append('otp', verifikasi.otp);
      const res = await postData(`/forgot-password/verify-otp`, formData);

      setSuccesOtp(true); // tampilkan pesan sukses

      localStorage.setItem('password_reset_token', res.password_reset_token);

      // console.log(res, 'verifikasi otp');
      setTimeout(() => {
        router('/perbarui-password');
      }, 1000);
    } catch (error) {
      setShake(true); // aktifkan animasi shake

      // Matikan shake setelah 600ms
      setTimeout(() => setShake(false), 600);
      // Reset input
      // setCode('');
      setActiveIndex(0);

      console.error('Gagal verifikasi otp:', error);
      let pesanError = 'Terjadi kesalahan saat verifikasi otp';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar((prev) => ({ ...prev, open: true, message: pesanError }));
    } finally {
      setVerifikasi({ otp: '', whatsapp: '' });
      setLoading(false);
      localStorage.removeItem('whatsapp');
    }
  };

  // handel verifikasi otp
  const handleChangeVerifikasiOtp = (e) => {
    let v = e.target.value.replace(/[^0-9]/g, ''); // Ambil hanya angka
    if (v.length > length) v = v.slice(0, length); // Batasi panjang sesuai length
    setVerifikasi((prev) => ({ ...prev, otp: v })); // Simpan ke state
    setActiveIndex(v.length); // Update posisi aktif
  };

  // Fokus ke input tersembunyi (verifikasi otp)
  const focusInput = () => hiddenRef.current?.focus();

  // Handle paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    // Ambil text clipboard, hanya angka
    const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

    // Simpan OTP hasil paste
    setVerifikasi((prev) => ({ ...prev, otp: text.slice(0, length) }));
  };

  // format waktu
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // handel perbarui password
  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('password_reset_token');
      //initialize formData
      const formData = new FormData();

      //append data to formData
      formData.append('password_reset_token', token);
      formData.append('password', newPassword.password);
      formData.append('password_confirmation', newPassword.password_confirmation);
      const res = await postData(`/forgot-password/reset-password`, formData);
      setSuccessPerbaruiPassword(true);

      useAuthStore.getState().clearAuth(); // hapus token sebelumnya

      // ⏳ tunggu 1 detik sebelum redirect
      setTimeout(() => {
        router('/login');
      }, 1000);
    } catch (error) {
      console.error('Gagal verifikasi nomor hp:', error);
      let pesanError = 'Terjadi kesalahan saat verifikasi nomor hp';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar((prev) => ({ ...prev, open: true, message: pesanError }));
    } finally {
      setNewPassword({ password: '', password_confirmation: '' });
      localStorage.removeItem('password_reset_token'); // hapus token ganti password
      setLoading(false);
    }
  };

  // lihat password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // lihat konfirmasi password
  const handleShowConfirmPassword = () => {
    setShowConfirmPass(!showConfirmPass);
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value }); // input change
  const handleChangeVerifikasi = (e) => setVerifikasi({ ...verifikasi, [e.target.name]: e.target.value }); // input change
  const handleChangeNewPassword = (e) => setNewPassword({ ...newPassword, [e.target.name]: e.target.value }); // input change
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ open: false, message: '', succes: false });
  }; // snackbar close

  return {
    value: {
      data,
      loading,
      snackbar,
      showPassword,
      verifikasi,
      activeIndex,
      shake,
      hiddenRef,
      canResend,
      length,
      timer,
      newPassword,
      showConfirmPass,
      succesOtp,
      successPerbaruiPassword,
      verifikasi_no_hp
    },
    func: {
      loginHandler,
      handleShowPassword,
      handleMouseDownPassword,
      handleChange,
      closeSnackbar,
      handleLogout,
      handleChangeVerifikasi,
      handleVerifikasiWa,
      VerifikasiOtp,
      handleChangeVerifikasiOtp,
      focusInput,
      handlePaste,
      handleUpdatePassword,
      handleChangeNewPassword,
      handleShowConfirmPassword,
      handleLupaPassword,
      formatTime
    }
  };
}
