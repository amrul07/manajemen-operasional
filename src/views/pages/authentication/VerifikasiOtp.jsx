import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { Box, Paper, Stack, Button, Fade, Snackbar, Alert, CircularProgress } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import { useNavigate } from 'react-router-dom';
import UseAuthenticationLogic from './AuthenticationLogic';

export default function VerifikasiOtp({ length = 6 }) {
  const { value, func } = UseAuthenticationLogic();

  const boxes = Array.from({ length }).map((_, i) => (
    <Box
      key={i}
      onClick={func.focusInput}
      sx={{
        width: { xs: 35, md: 56 },
        height: { xs: 40, md: 56 },
        borderRadius: 2,
        border: i === value.activeIndex ? '2px solid #1e88e5' : '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 600,
        bgcolor: 'background.paper',
        boxShadow: i === value.activeIndex ? 3 : 1,
        transition: 'all .15s ease',
        cursor: 'text'
      }}
    >
      {value.verifikasi.otp[i] || ''}
    </Box>
  ));

  return (
    <AuthWrapper1>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        .shake { animation: shake 0.5s; }
      `}</style>
        <AuthCardWrapper>
          {/* <Paper sx={{ width: { xs: '95%', sm: 500 }, p: 4, borderRadius: 4 }} elevation={8}> */}
          <Stack spacing={2} alignItems="center" sx={{ p: { xs: 1, md: 4 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'white'
                }}
              >
                <CheckCircleOutlineIcon />
              </Box>
              <Box>
                <Poppins variant="h6" fontWeight={700}>
                  Verifikasi OTP
                </Poppins>
                <Poppins variant="body2" color="text.secondary">
                  Kode dikirim ke {value.verifikasi.whatsapp}
                </Poppins>
              </Box>
            </Box>

            {/* Timer */}
            <Poppins variant="body2" color="text.secondary">
              Kode akan kedaluwarsa dalam <b>{value.timer}s</b>
            </Poppins>

            {/* OTP Boxes */}
            <Box
              className={value.shake ? 'shake' : ''}
              sx={{ display: 'flex', gap: 1.5, mt: 1, maxWidth: '95%' }}
              onClick={func.focusInput}
            >
              {boxes}
            </Box>

            {/* Hidden Input */}
            <input
              ref={value.hiddenRef}
              value={value.verifikasi.otp}
              onChange={func.handleChangeVerifikasiOtp}
              onPaste={func.handlePaste}
              inputMode="numeric"
              autoFocus
              style={{ position: 'absolute', opacity: 0, left: -9999 }}
            />

            {/* Buttons */}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, borderRadius: 2, py: 1.3, fontFamily: `'Poppins', sans-serif` }}
              disabled={value.verifikasi.otp.length !== 6}
              onClick={func.VerifikasiOtp}
            >
              Verifikasi{' '}
              {value.loading === true && (
                <CircularProgress
                  size={18}
                  sx={{
                    color: '#FFF',
                    ml: '5px'
                  }}
                />
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<RestartAltIcon />}
              onClick={func.handleVerifikasiWa}
              disabled={!value.canResend}
              sx={{ borderRadius: 2, fontFamily: `'Poppins', sans-serif` }}
            >
              {value.canResend ? 'Kirim Ulang Kode' : `Kirim ulang (${value.timer}s)`}
            </Button>

            <Fade in={value.succesOtp}>
              <Poppins sx={{ color: 'success.main', fontWeight: 700, mt: 1 }}>OTP berhasil diverifikasi ✓</Poppins>
            </Fade>
          </Stack>
          {/* </Paper> */}
        </AuthCardWrapper>
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
