import {
  Card,
  Grid,
  Stack,
  Box,
  Autocomplete,
  Snackbar,
  Alert,
  TextField,
  InputBase,
  OutlinedInput,
  CircularProgress
} from '@mui/material';
import React from 'react';
import { Poppins } from '../../../ui-component/typography/Poppins';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../ui-component/modal/CustomModal';
import IconImage from '../../../assets/image.svg';
import Sukses from '../../../assets/sukses.svg';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import AbsensiSayaLogic from './AbsensiSayaLogic';
import { IconTrash } from '@tabler/icons-react';

export default function AbsensiSaya() {
  const { value, func } = AbsensiSayaLogic();
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
    background: '#ffffff', // background card
    '&:hover': {
      background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)', // background ketika hover
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
      {value.loadingGet === true ? (
        <Stack sx={{ alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ margin: 'auto', color: '#1e88e5' }} size={'50px'} />
        </Stack>
      ) : (
        <>
          <Stack>
            {/* title riwayat absensi */}
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
                background: '#ffffff', // bacground
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)', // background ketika di hover
                  color: '#fff',
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 6px 16px rgba(30,136,229,0.35)'
                }
              }}
              onClick={() => router('/absensi-saya/riwayat-absensi')}
            >
              {/* title lihat riwayat */}
              <Poppins sx={{ fontWeight: 500 }}>Lihat Riwayat</Poppins>
            </Box>
          </Stack>
          {/* Buttons */}
          {/* absen masuk */}
          <Grid container spacing={3} mt={4} justifyContent="center">
            <Grid size={{ xs: 6, sm: 4 }}>
              <Stack sx={menuItemStyle} onClick={func.handleClockIn}>
                {value.loading ? (
                  <CircularProgress size={38} sx={{ color: '#1e88e5' }} />
                ) : (
                  <AccessTimeFilledIcon sx={{ fontSize: 38, mb: 1 }} /> // icon
                )}
                {/* title Clock In */}
                <Poppins sx={{ fontSize: '16px', fontWeight: 600 }}>Clock In</Poppins>
              </Stack>
            </Grid>
            {/* absen pulang */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <Stack sx={menuItemStyle} onClick={func.handleClockOut}>
                {value.loadingClockOut ? (
                  <CircularProgress size={38} sx={{ color: '#1e88e5' }} />
                ) : (
                  <LogoutIcon sx={{ fontSize: 38, mb: 1 }} /> // icon
                )}
                {/* title Clock Out */}
                <Poppins sx={{ fontSize: '16px', fontWeight: 600 }}>Clock Out</Poppins>
              </Stack>
            </Grid>
            {/* izin/sakit */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <Stack sx={menuItemStyle} onClick={func.handleModalIzin}>
                <MedicalInformationIcon sx={{ fontSize: 38, mb: 1 }} /> {/* icon */}
                {/* title izin / sakit */}
                <Poppins sx={{ fontSize: '16px', fontWeight: 600 }}>Izin / Sakit</Poppins>
              </Stack>
            </Grid>
          </Grid>
        </>
      )}

      {/* modal izin/sakit */}
      <CustomModal open={value.modal.izin} handleClose={func.handleCloseModal}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* bukti */}
            <Poppins sx={{ fontWeight: 500 }}>* Bukti</Poppins>
            <Grid container spacing={2}>
              <Grid size={6}>
                {/* image */}
                <Stack
                  sx={{
                    border: '1px dashed #576974',
                    borderRadius: '8px',
                    // width: { xs: '50%', md: '45%' },
                    mt: 1
                  }}
                >
                  <img
                    src={IconImage}
                    width={50}
                    style={{
                      // width: "50px",
                      // margin: "0 auto",
                      margin: 'auto',
                      marginTop: '22px'
                    }}
                    alt="ta"
                  />
                  {/* title tarik dan lepas foto di sini */}
                  <Poppins
                    sx={{
                      width: '80%',
                      alignSelf: 'center',
                      color: '#576974',
                      textAlign: 'center'
                    }}
                  >
                    Tarik dan lepas foto di sini
                  </Poppins>
                  {/* button */}
                  <ButtonStyle
                    mt={'30px'}
                    // mb={"20px"}
                    width={'100%'}
                    height={'35px'}
                    bg={'#1e88e5'}
                    color={'#fff'}
                    hover={'#1b71bcff'}
                    onClick={func.handleChooseFileClick}
                    value={value.izin.image_proof}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={func.handleImageChange}
                      // value={value.izin.image_proof}
                    />
                    Pilih File
                  </ButtonStyle>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack sx={{ mt: 1 }}>
                  {/* foto yg di pilih */}
                  {value.previewImage ? (
                    <Stack sx={{ position: 'relative' }}>
                      <img style={{ borderRadius: '8px' }} src={value.previewImage} alt={''} width={'100%'} height={180} />
                      <Stack
                        sx={{
                          position: 'absolute',
                          alignSelf: 'end',
                          cursor: 'pointer',
                          p: 1
                        }}
                      >
                        <IconTrash onClick={func.removeImage} color="red" size={'20px'} /> {/* icon hps foto */}
                      </Stack>
                    </Stack>
                  ) : (
                    <p style={{ fontFamily: `'Poppins', sans-serif` }}></p>
                  )}
                </Stack>
              </Grid>
            </Grid>
            {/* kategori */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Kategori</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Izin', 'Sakit']}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '8px',
                fontFamily: `'Poppins', sans-serif`
              }}
              value={value.izin.kategori || ''}
              onChange={func.handleChangeKategori}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="kategori"
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '8px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif`, borderRadius: '8px' }
                  }}
                  placeholder={'Pilih Kategori'}
                />
              )}
            />
            {/* keterangan */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Keterangan</Poppins>
            <OutlinedInput
              rows={4}
              multiline
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%'
              }}
              name="keterangan"
              size="small"
              placeholder="Masukkan Keterangan"
              value={value.izin.keterangan}
              onChange={func.handleChangeKeterangan}
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={func.handleIzin}>
            Kirim{' '}
            {value.loadingIzin === true && (
              <CircularProgress
                size={18}
                sx={{
                  color: '#FFF',
                  position: 'absolute',
                  mt: '5px',
                  ml: '5px'
                }}
              />
            )}
          </ButtonStyle>
          <ButtonStyle width={'45%'} bg={'red'} color={'#fff'} hover={'#af0202ff'} onClick={func.handleCloseModal}>
            Batal
          </ButtonStyle>
        </Stack>
      </CustomModal>
      {/* modal succes */}
      <CustomModal open={value.modal.succes} handleClose={func.handleCloseModal}>
        <Stack sx={{ alignItems: 'center', gap: 2 }}>
          <img src={Sukses} alt="sukses" style={{ width: '145px', height: '145px' }} />
          <Poppins sx={{ fontSize: '24px', fontWeight: 600 }}>Sukses!</Poppins>
          <Poppins sx={{ fontWeight: 400 }}>Anda Berhasil Absen</Poppins>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={func.handleCloseModal}>
            Kembali
          </ButtonStyle>
        </Stack>
      </CustomModal>
      {/* Snackbar */}
      <Snackbar
        open={value.snackbar.open}
        // autoHideDuration={5000}
        onClose={func.closeSnackbar}
        // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={func.closeSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontFamily: `'Poppins', sans-serif` }}>
          {value.snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
