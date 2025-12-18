import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, InputLabel, OutlinedInput, Paper, Snackbar } from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { useNavigate } from 'react-router-dom';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import CustomFormControl from '../../../ui-component/extended/Form/CustomFormControl';
import UseAuthenticationLogic from './AuthenticationLogic';

export default function VerifikasiNoHp({}) {
  const { value, func } = UseAuthenticationLogic();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useNavigate();

  const handleSubmit = () => {
    if (!/^[0-9]{10,15}$/.test(phone)) {
      setError('Nomor HP tidak valid');
      return;
    }
    setError('');
    console.log('Phone submitted:', phone);
  };

  //   ketia button d klik
  const onClick = (url) => {
    router(url);
  };

  return (
    <AuthWrapper1>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AuthCardWrapper>
          <Paper
            // elevation={6}
            sx={{
              // width: { xs: '100%', sm: 420 },
              p: 2,
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
                background: '#1e88e5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2
              }}
            >
              <PhoneAndroidIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Poppins sx={{ fontWeight: 700, mb: 1 }}>Verifikasi Nomor HP</Poppins>
            <Poppins sx={{}}>Masukkan nomor handphone untuk melanjutkan.</Poppins>
            {/* input no Hp */}
            <CustomFormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-email-login" sx={{ fontFamily: `'Poppins', sans-serif` }}>
                Nomor Hp
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                name="whatsapp"
                value={value.verifikasi.whatsapp}
                onChange={func.handleChangeVerifikasi}
                sx={{ fontFamily: `'Poppins', sans-serif` }}
              />
            </CustomFormControl>
            {/* button kirim otp */}
            <AnimateButton>
              <ButtonStyle bg={'#1e88e5'} color={'#fff'} width={'100%'} height={'40px'} hover={'#1e88e5'} onClick={func.handleVerifikasiWa}>
                Kirim Kode OTP{' '}
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
            </AnimateButton>
          </Paper>
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
