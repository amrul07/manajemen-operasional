import React, { useState } from 'react';
import { postData } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AuthenticationLogic() {
  const router = useNavigate();
  const [data, setData] = useState({ wa: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  //   ketika tombol login di klik
  const loginHandler = async (e) => {
    e.preventDefault();

    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append('wa', data.wa);
    formData.append('password', data.password);

    //send data to server
    await postData(`/login`, formData)
      .then((response) => {
        //set token on cookies
        Cookies.set('token', response.token);
        setLoading(true);
        //redirect to dashboard
        router.push('/dashboard');
        console.log({ response });
      })
      .catch((error) => {
        console.error('Gagal login data:', error);
        let pesanError = 'Terjadi kesalahan saat login';

        if (error.response) {
          pesanError = error.response.data.message || pesanError;
        }

        setSnackbar({
          open: true,
          message: pesanError
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // lihat password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value }); // input change
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ open: false, message: '' });
  }; // snackbar close

  return {
    value: { data, loading, snackbar, showPassword },
    func: { loginHandler, handleShowPassword, handleMouseDownPassword, handleChange, closeSnackbar }
  };
}
