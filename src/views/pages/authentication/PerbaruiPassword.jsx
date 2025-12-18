import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Alert, Snackbar, Fade, CircularProgress } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthWrapper1 from './AuthWrapper1';
import { Poppins } from '../../../ui-component/typography/Poppins';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import CustomFormControl from '../../../ui-component/extended/Form/CustomFormControl';
import { useNavigate } from 'react-router-dom';
import UseAuthenticationLogic from './AuthenticationLogic';

export default function UpdatePassword() {
  const { value, func } = UseAuthenticationLogic();


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
              // id="outlined-adornment-password-login"
              type={value.showPassword ? 'text' : 'password'}
              value={value.newPassword.password}
              onChange={func.handleChangeNewPassword}
              name="password"
              sx={{ fontFamily: `'Poppins', sans-serif` }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={func.handleShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {value.showPassword ? <Visibility /> : <VisibilityOff />}
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
              // id="outlined-adornment-password-login"
              type={value.showConfirmPass ? 'text' : 'password'}
              value={value.newPassword.password_confirmation}
              onChange={func.handleChangeNewPassword}
              name="password_confirmation"
              sx={{ fontFamily: `'Poppins', sans-serif` }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={func.handleShowConfirmPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {value.showConfirmPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </CustomFormControl>

          {/* <Poppins sx={{ color: 'red', fontSize: 14, mb: 2 }}>peh</Poppins> */}

          <ButtonStyle bg={'#1e88e5'} color={'#fff'} hover={'#1c73beff'} width={'100%'} height={'40px'} onClick={func.handleUpdatePassword}>
            Perbarui Password{' '}
            {value.loading === true && (
              <CircularProgress
                size={18}
                sx={{
                  color: '#FFF',
                  ml: '5px'
                }}
              />
            )}
          </ButtonStyle>
          <Fade in={value.successPerbaruiPassword}>
            <Poppins sx={{ color: 'success.main', fontWeight: 700, mt: 1 }}>Password berhasil diperbarui ✓</Poppins>
          </Fade>
        </Paper>
      </Box>
      {/* snackbar */}
      <Snackbar
        open={value.snackbar.open}
        // autoHideDuration={5000}
        onClose={func.closeSnackbar}
        // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={func.closeSnackbar}
          severity={value.snackbar.succes ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%', fontFamily: `'Poppins', sans-serif` }}
        >
          {value.snackbar.message}
        </Alert>
      </Snackbar>
    </AuthWrapper1>
  );
}
