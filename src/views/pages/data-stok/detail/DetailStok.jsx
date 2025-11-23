import { Box, Card, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { Poppins } from '.././../../../ui-component/typography/Poppins';
import Image from '../../../../assets/image.jpeg';
import CustomButton from '../../../../ui-component/button/CustomButton';
import ButtonStyle from '../../../../ui-component/button/ButtonStyle';

export default function DetailStok() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box>
      <Card sx={{ mt: 2, p: 4 }}>
        <Grid container spacing={2}>
          {/* nama barang */}
          <Grid size={6}>
            <Poppins>Nama Barang </Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: Pulpen</Poppins>
          </Grid>
          {/* kode barang */}
          <Grid size={6}>
            <Poppins>Kode Barang </Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: 12345</Poppins>
          </Grid>
          {/* Harga Barang */}
          <Grid size={6}>
            <Poppins>Harga Barang</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: 10.000</Poppins>
          </Grid>
          {/* Stok */}
          <Grid size={6}>
            <Poppins>Stok</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: 200</Poppins>
          </Grid>
          {/* Stok Awal */}
          <Grid size={6}>
            <Poppins>Stok Awal</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: 100</Poppins>
          </Grid>
          {/* Tanggal Masuk */}
          <Grid size={6}>
            <Poppins>Tanggal Masuk</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: 20 Desember 2025</Poppins>
          </Grid>
          {/* Tanggal Update */}
          <Grid size={6}>
            <Poppins>Tanggal Update</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: 22 Desember 2025</Poppins>
          </Grid>
          {/* Supplier */}
          <Grid size={6}>
            <Poppins>Supplier</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: Cv. Indo Retail Abadi</Poppins>
          </Grid>
          {/* Jenis Barang */}
          <Grid size={6}>
            <Poppins>Jenis Barang</Poppins>
          </Grid>
          <Grid size={6}>
            <Poppins>: Atk</Poppins>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
