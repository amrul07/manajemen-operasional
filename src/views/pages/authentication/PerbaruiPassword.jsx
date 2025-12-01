import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthWrapper1 from './AuthWrapper1';
import { Poppins } from '../../../ui-component/typography/Poppins';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import CustomFormControl from '../../../ui-component/extended/Form/CustomFormControl';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const router = useNavigate()

  const handleUpdate = (url) => {
    if (password.length < 6) return setError('Password harus minimal 6 karakter');

    if (password !== confirmPassword) return setError('Konfirmasi password tidak cocok');

    setError('');
    console.log('Password Updated!');
    router(url)
  };

  return (
    <AuthWrapper1>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2
        }}
      >
        <Paper
          //   elevation={6}
          sx={{
            width: { xs: '100%', sm: 420 },
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              borderRadius: '50%',
              background: '#5b6ee1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}
          >
            <LockResetIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Poppins variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Perbarui Password
          </Poppins>
          <Poppins sx={{ mb: 3 }}>Silahkan masukkan password baru kamu.</Poppins>

          {/* password baru */}
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-password-login" sx={{ fontFamily: `'Poppins', sans-serif` }}>
              Password Baru
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              sx={{ fontFamily: `'Poppins', sans-serif` }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPass(!showPass)}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </CustomFormControl>
          {/* confirm password baru */}
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-password-login" sx={{ fontFamily: `'Poppins', sans-serif` }}>
              Konfirmasi Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showConfirmPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="password"
              sx={{ fontFamily: `'Poppins', sans-serif` }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showConfirmPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </CustomFormControl>

          {error && <Poppins sx={{ color: 'red', fontSize: 14, mb: 2 }}>{error}</Poppins>}

          <ButtonStyle bg={'#1e88e5'} color={'#fff'} hover={'#1c73beff'} width={'100%'} height={'40px'} onClick={() => handleUpdate('/login')}>
            Perbarui Password
          </ButtonStyle>
        </Paper>
      </Box>
    </AuthWrapper1>
  );
}
