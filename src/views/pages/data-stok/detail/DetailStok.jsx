import { Box, Card, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Poppins } from '.././../../../ui-component/typography/Poppins';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../api/api';
import { set, get } from 'idb-keyval';

export default function DetailStok() {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      if (navigator.onLine) {
        // ONLINE → Ambil dari API
        const res = await fetchData(`/admin/stok/${id}`);
        const detail = res.data;

        setData(detail);

        // simpan ke IndexedDB
        await set(`stok-${id}`, detail);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cached = await get(`stok-${id}`);

        if (cached) {
          setData(cached);
        } else {
          setData({ error: 'Data tidak tersedia offline' });
        }
      }
    } catch (err) {
      console.log('Error load:', err);

      // Jika error API → coba fallback ke IndexedDB
      const cached = await get(`stok-${id}`);
      if (cached) {
        setData(cached);
      }
    }
  };
  return (
    <Box>
      <Card sx={{ mt: 2, p: 4 }}>
        {!data && <Poppins>Loading...</Poppins>}

        {data?.error && <Poppins style={{ color: 'red' }}>{data.error}</Poppins>}
        {data && !data.error && (
          <Grid container spacing={2}>
            {/* nama barang */}
            <Grid size={6}>
              <Poppins>Nama Barang </Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.nama}</Poppins>
            </Grid>
            {/* kode barang */}
            <Grid size={6}>
              <Poppins>Kode Barang </Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.kode_barang}</Poppins>
            </Grid>
            {/* Harga Barang */}
            <Grid size={6}>
              <Poppins>Harga Barang</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: Rp.{data.harga}</Poppins>
            </Grid>
            {/* Stok */}
            <Grid size={6}>
              <Poppins>Stok</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.stok_total}</Poppins>
            </Grid>
            {/* Stok Awal */}
            <Grid size={6}>
              <Poppins>Stok Awal</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.stok_awal}</Poppins>
            </Grid>
            {/* Tanggal Masuk */}
            <Grid size={6}>
              <Poppins>Tanggal Masuk</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.tanggal_masuk}</Poppins>
            </Grid>
            {/* Tanggal Update */}
            <Grid size={6}>
              <Poppins>Tanggal Update</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.tanggal_update}</Poppins>
            </Grid>
            {/* Supplier */}
            <Grid size={6}>
              <Poppins>Supplier</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.supplier}</Poppins>
            </Grid>
            {/* Jenis Barang */}
            <Grid size={6}>
              <Poppins>Jenis Barang</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.sub_kategori}</Poppins>
            </Grid>
          </Grid>
        )}
      </Card>
    </Box>
  );
}
