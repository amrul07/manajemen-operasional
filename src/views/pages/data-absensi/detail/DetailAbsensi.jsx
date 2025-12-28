import { Alert, Box, Card, CircularProgress, Grid, Snackbar, Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Poppins } from '.././../../../ui-component/typography/Poppins';
import ButtonStyle from '../../../../ui-component/button/ButtonStyle';
import { fetchData, postData } from '../../../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { set, get } from 'idb-keyval';

export default function DetailAbsensi() {
  const router = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [data, setData] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingNonApprove, setLoadingNonApprove] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      if (navigator.onLine) {
        // ONLINE → Ambil dari API
        const res = await fetchData(`/data-absensi/bukti-izin-sakit/${id}`);
        const detail = res.data;

        setData(detail);

        // simpan ke IndexedDB
        await set(`absensi-detail-${id}`, detail);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cached = await get(`absensi-detail-${id}`);

        if (cached) {
          setData(cached);
        } else {
          setData({ error: 'Data tidak tersedia offline' });
        }
      }
    } catch (err) {
      console.log('Error load:', err);

      // Jika error API → coba fallback ke IndexedDB
      const cached = await get(`absensi-detail-${id}`);
      if (cached) {
        setData(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  // setujui izin/sakit
  const handleApprove = async () => {
    setLoadingApprove(true);
    try {
      const formData = new FormData();
      formData.append('status', 'Disetujui');
      formData.append('_method', 'PATCH');
      await postData(`/data-absensi/approve-izin-sakit/${id}`, formData); //
      router(`/data-absensi`);
    } catch (error) {
      console.error('Gagal mengedit data:', error);
      let pesanError = 'Terjadi kesalahan saat mengedit data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setLoadingApprove(false);
    }
  };

  // tolak izin/sakit
  const handleNonApprove = async () => {
    setLoadingNonApprove(true);
    try {
      const formData = new FormData();
      formData.append('status', 'Tidak Disetujui');
      formData.append('_method', 'PATCH');
      await postData(`/data-absensi/approve-izin-sakit/${id}`, formData); //
      router(`/data-absensi`);
    } catch (error) {
      console.error('Gagal mengedit data:', error);
      let pesanError = 'Terjadi kesalahan saat mengedit data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setLoadingNonApprove(false);
    }
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ open: false, message: '' });
  }; // snackbar close

  return (
    <Box>
      {loading ? (
        <Stack sx={{ alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ margin: 'auto', color: '#1e88e5' }} size={'50px'} />
        </Stack>
      ) : (
        <Card sx={{ mt: 2, p: 4 }}>
          {!data ? (
            // jika bukti izin/sakit tidak ada
            <Poppins sx={{ color: 'red' }}>Bukti izin/sakit tidak tersedia</Poppins>
          ) : (
            // <Poppins>{err}</Poppins>
            <>
              <Grid container spacing={2}>
                {/* nama */}
                <Grid size={4}>
                  <Poppins sx={{}}>Nama Lengkap</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.user}</Poppins> {/* data nama */}
                </Grid>
                {/* tanggal */}
                <Grid size={4}>
                  <Poppins sx={{}}>Tanggal</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.tanggal}</Poppins> {/* data tanggal */}
                </Grid>
                {/* ketegori */}
                <Grid size={4}>
                  <Poppins sx={{}}>Kategori</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.kategori}</Poppins> {/* data kategori */}
                </Grid>
                {/* keterangan */}
                <Grid size={4}>
                  <Poppins sx={{}}>Keterangan</Poppins>
                </Grid>
                <Grid size={8}>
                  <Poppins sx={{}}>: {data.keterangan}</Poppins> {/* data keterangan */}
                </Grid>
                {/* bukt */}
                <Grid size={4}>
                  <Poppins sx={{}}>Bukti</Poppins>
                </Grid>
                <Grid size={8}>
                  <Stack sx={{ flexDirection: 'row', gap: 2 }}>
                    <p>:</p>
                    {/* data bukti */}
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
              <Stack sx={{ flexDirection: 'row', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2, mt: 2 }}>
                <ButtonStyle width={'120px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={handleApprove}>
                  Terima
                  {loadingApprove === true && (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: '#FFF',
                        position: 'absolute',
                        mt: '3px',
                        ml: '5px'
                      }}
                    />
                  )}
                </ButtonStyle>
                <ButtonStyle width={'120px'} bg={'red'} color={'#fff'} hover={'#af0202ff'} onClick={handleNonApprove}>
                  Tolak
                  {loadingNonApprove === true && (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: '#FFF',
                        position: 'absolute',
                        mt: '3px',
                        ml: '5px'
                      }}
                    />
                  )}
                </ButtonStyle>
              </Stack>
            </>
          )}
        </Card>
      )}
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        // autoHideDuration={5000}
        onClose={closeSnackbar}
        // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontFamily: `'Poppins', sans-serif` }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
