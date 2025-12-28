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
        {/* jika data blm terambil maka tampilkan loading... */}
        {!data && <Poppins>Loading...</Poppins>}

        {data?.error && <Poppins style={{ color: 'red' }}>{data.error}</Poppins>}
        {data && !data.error && (
          <Grid container spacing={2}>
            {/* nama barang */}
            <Grid size={6}>
              <Poppins>Nama Barang </Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.nama}</Poppins> {/* data nama */}
            </Grid>
            {/* kode barang */}
            <Grid size={6}>
              <Poppins>Kode Barang </Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.kode_barang}</Poppins> {/* data kode barang */}
            </Grid>
            {/* Harga Barang */}
            <Grid size={6}>
              <Poppins>Harga Barang</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: Rp.{data.harga}</Poppins> {/* data harga */}
            </Grid>
            {/* Stok */}
            <Grid size={6}>
              <Poppins>Stok</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.stok_total}</Poppins> {/* data stok */}
            </Grid>
            {/* Stok Awal */}
            <Grid size={6}>
              <Poppins>Stok Awal</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.stok_awal}</Poppins> {/* data stok awal */}
            </Grid>
            {/* Tanggal Masuk */}
            <Grid size={6}>
              <Poppins>Tanggal Masuk</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.tanggal_masuk}</Poppins> {/* data tanggal masuk */}
            </Grid>
            {/* Tanggal Update */}
            <Grid size={6}>
              <Poppins>Tanggal Update</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.tanggal_update}</Poppins> {/* data tanggal update */}
            </Grid>
            {/* Jenis Barang */}
            <Grid size={6}>
              <Poppins>Jenis Barang</Poppins>
            </Grid>
            <Grid size={6}>
              <Poppins>: {data.sub_kategori}</Poppins> {/* data sub kategori */}
            </Grid>
          </Grid>
        )}
      </Card>
    </Box>
  );
}
