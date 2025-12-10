import { Card, Grid, Stack, Box } from '@mui/material';
import React from 'react';
import { Poppins } from '../../../ui-component/typography/Poppins';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { useNavigate } from 'react-router-dom';

export default function AbsensiSaya() {
  const router = useNavigate();
  const menuItemStyle = {
    border: '1.5px solid #1e88e5',
    // width: '300px',
    // width: { xs: '100%', sm: '90%', md: '70%' },
    height: { xs: '80px', md: '120px' },
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.35s ease',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.08)',
    background: '#ffffff',
    '&:hover': {
      background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
      color: '#fff',
      transform: 'translateY(-6px) scale(1.03)',
      boxShadow: '0px 10px 20px rgba(30,136,229,0.35)'
    }
  };

  return (
    <Card
      sx={{
        p: { xs: 3, md: 4 },
        // borderRadius: '18px',
        boxShadow: '0px 8px 24px rgba(0,0,0,0.08)'
      }}
    >
      {/* Title */}
      <Stack>
        <Poppins sx={{ fontSize: '24px', fontWeight: 700, color: '#1e88e5' }}>Riwayat Absensi</Poppins>
        {/* button lihat riwayat */}
        <Box
          sx={{
            mt: 2,
            border: '1.5px solid #1e88e5',
            width: '180px',
            p: 1.2,
            borderRadius: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: '0.35s ease',
            background: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
              color: '#fff',
              transform: 'translateY(-4px)',
              boxShadow: '0px 6px 16px rgba(30,136,229,0.35)'
            }
          }}
          onClick={() => router('/absensi-saya/riwayat-absensi')}
        >
          <Poppins sx={{ fontWeight: 500 }}>Lihat Riwayat</Poppins>
        </Box>
      </Stack>

      {/* Buttons */}
      <Grid container spacing={3} mt={4} justifyContent="center">
        <Grid size={{ xs: 6, sm: 4 }}>
          <Stack sx={menuItemStyle}>
            <AccessTimeFilledIcon sx={{ fontSize: 38, mb: 1 }} />
            <Poppins sx={{ fontSize: '16px', fontWeight: 600 }}>Clock In</Poppins>
          </Stack>
        </Grid>

        <Grid size={{ xs: 6, sm: 4 }}>
          <Stack sx={menuItemStyle}>
            <LogoutIcon sx={{ fontSize: 38, mb: 1 }} />
            <Poppins sx={{ fontSize: '16px', fontWeight: 600 }}>Clock Out</Poppins>
          </Stack>
        </Grid>

        <Grid size={{ xs: 6, sm: 4 }}>
          <Stack sx={menuItemStyle}>
            <MedicalInformationIcon sx={{ fontSize: 38, mb: 1 }} />
            <Poppins sx={{ fontSize: '16px', fontWeight: 600 }}>Izin / Sakit</Poppins>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
