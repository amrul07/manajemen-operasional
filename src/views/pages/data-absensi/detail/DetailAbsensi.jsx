import { Box, Card, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { Poppins } from '.././../../../ui-component/typography/Poppins';
import Image from '../../../../assets/image.jpeg';
import CustomButton from '../../../../ui-component/button/CustomButton';
import ButtonStyle from '../../../../ui-component/button/ButtonStyle';

export default function DetailAbsensi() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box>
      <Card sx={{ mt: 2, p: 4 }}>
        <Grid container spacing={2}>
          <Grid item size={4}>
            <Poppins sx={{ mt: 2 }}>Nama Lengkap</Poppins>
            <Poppins sx={{ mt: 2 }}>Izin/Sakit</Poppins>
            <Poppins sx={{ mt: 2 }}>Bukti</Poppins>
          </Grid>
          <Grid item size={8}>
            <Poppins sx={{ mt: 2 }}>: Alif Ramadha</Poppins>
            <Poppins sx={{ mt: 2 }}>: Izin</Poppins>
            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
              <p>:</p>
              <img
                src={Image}
                alt="image"
                style={{
                  width: isMobile ? '150px' : '300px',
                  height: isMobile ? '150px' : '300px',
                  marginTop: '20px',
                  borderRadius: '12px'
                }}
              />
            </Stack>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2, mt: 4 }}>
          <ButtonStyle width={'120px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Terima
          </ButtonStyle>
          <ButtonStyle width={'120px'} bg={'red'} color={'#fff'} hover={'#af0202ff'}>
            Tolak
          </ButtonStyle>
        </Stack>
      </Card>
    </Box>
  );
}
