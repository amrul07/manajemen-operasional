import { Box, Card, CircularProgress, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Poppins } from '.././../../../ui-component/typography/Poppins';
import Image from '../../../../assets/image.jpeg';
import CustomButton from '../../../../ui-component/button/CustomButton';
import ButtonStyle from '../../../../ui-component/button/ButtonStyle';
import { fetchData } from '../../../../api/api';
import { useParams } from 'react-router-dom';
import { set, get } from 'idb-keyval';

export default function DetailAbsensi() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [data, setData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      if (navigator.onLine) {
        // ONLINE → Ambil dari API
        const res = await fetchData(`/data-absensi/bukti-izin-sakit/${id}`);
        const detail = res.data;

        setData(detail);

        // simpan ke IndexedDB
        await set(`cetakbarangMasuk-${id}`, detail);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cached = await get(`cetakbarangMasuk-${id}`);

        if (cached) {
          setData(cached);
        } else {
          setData({ error: 'Data tidak tersedia offline' });
        }
      }
    } catch (err) {
      console.log('Error load:', err);

      // Jika error API → coba fallback ke IndexedDB
      const cached = await get(`cetakbarangMasuk-${id}`);
      if (cached) {
        setData(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log({ data });
  return (
    <Box>
      {loading ? (
        <Stack sx={{ alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ margin: 'auto', color: '#1e88e5' }} size={'50px'} />
        </Stack>
      ) : (
        <Card sx={{ mt: 2, p: 4 }}>
          {data.length === 0 ? (
            <Poppins sx={{ color: 'red' }}>Tidak ada data</Poppins>
          ) : (
            <>
              <Grid container spacing={2}>
                {/* nama */}
                <Grid size={4}>
                  <Poppins sx={{}}>Nama Lengkap</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.user}</Poppins>
                </Grid>
                {/* keterangan */}
                <Grid size={4}>
                  <Poppins sx={{}}>Keterangan</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.keterangan}</Poppins>
                </Grid>
                {/* tanggal */}
                <Grid size={4}>
                  <Poppins sx={{}}>Tanggal</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.tanggal}</Poppins>
                </Grid>
                {/* bukt */}
                <Grid size={4}>
                  <Poppins sx={{}}>Bukti</Poppins>
                </Grid>
                <Grid size={8}>
                  <Stack sx={{ flexDirection: 'row', gap: 2 }}>
                    <p>:</p>
                    <img
                      src={data.image}
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
              <Stack sx={{ flexDirection: 'row', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
                <ButtonStyle width={'120px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
                  Terima
                </ButtonStyle>
                <ButtonStyle width={'120px'} bg={'red'} color={'#fff'} hover={'#af0202ff'}>
                  Tolak
                </ButtonStyle>
              </Stack>
            </>
          )}
        </Card>
      )}
    </Box>
  );
}
