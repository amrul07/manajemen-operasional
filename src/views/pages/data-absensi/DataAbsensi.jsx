import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Grid,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider
} from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from '../../../ui-component/table/StyledTableCell';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { themePagination } from '../../../ui-component/pagination/Pagination';
import { dataAbsensi, menuItem, menuStatus } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import { IconArrowBadgeRight, IconArrowBigRight, IconArrowNarrowRight, IconPrinter } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import Sukses from '../../../assets/sukses.svg';
import CreateIcon from '@mui/icons-material/Create';
import DataAbsensiLogic from './DataAbsensiLogic';
import useGlobalStore from '../../../store/globalStore';

export default function DataAbsensi() {
  const { value, func } = DataAbsensiLogic();
  const role = useGlobalStore((state) => state.role);
  return (
    // {/* tabel */}
    <Card sx={{ mt: 2 }}>
      {value.loadingGet === true ? (
        <Stack sx={{ alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ margin: 'auto', color: '#1e88e5' }} size={'50px'} />
        </Stack>
      ) : (
        <TableContainer sx={{ px: 5, fontFamily: "`'Poppins', sans-serif`" }} component={Paper}>
          <Table>
            <TableHead sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              <TableRow>
                {/* dropdown tampilkan .. data */}
                <TableCell
                  colSpan={2}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`"
                  }}
                >
                  <Select
                    size="small"
                    value={value.dataDropdown || ''}
                    onChange={(e) => func.handleChangeDataDropdown(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ mt: '5px', fontFamily: `'Poppins', sans-serif`, width: '180px' }}
                  >
                    {value.dataTanggal.map((res) => (
                      // title dropdown
                      <MenuItem sx={{ fontFamily: `'Poppins', sans-serif` }} key={res.id} value={res}>
                        {res.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                {/* button cetak laporan */}
                <TableCell
                  colSpan={4}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    textAlign: 'end'
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      mt: '5px',
                      backgroundColor: '#1e88e5',  // background
                      color: '#FFFFFF', // color
                      textTransform: 'none',
                      gap: 1,
                      px: 2,
                      height: '35px',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={func.handleModalCetak}
                  >
                    <IconPrinter /> {/* icon */}
                    <Poppins sx={{ fontWeight: 500 }}>Cetak Laporan</Poppins> {/* title button */}
                  </Button>
                </TableCell>
              </TableRow>
              {/*  */}
              <TableRow>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nomor</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Waktu CheckIn </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Waktu CheckOut </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Status</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    textAlign: 'center',
                    display: role !== 'Pimpinan' ? 'none' : '-moz-initial'
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {value.data.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={5}>Tidak ada data</StyledTableCell>
                </StyledTableRow>
              )}
              {value.loadingPagination ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={5}>Loading...</StyledTableCell>
                </StyledTableRow>
              ) : (
                value.data &&
                value.data.map((row, i) => {
                  return (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{(value.page - 1) * value.itemsPerPage + i + 1}</StyledTableCell>
                      <StyledTableCell>{row.user}</StyledTableCell>
                      <StyledTableCell>{row.waktu_checkin}</StyledTableCell>
                      <StyledTableCell>{row.waktu_checkout}</StyledTableCell>
                      <StyledTableCell>{row.status}</StyledTableCell>
                      <StyledTableCell sx={{ display: role !== 'Pimpinan' ? 'none' : '-moz-initial' }}>
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            gap: { xs: 1, md: 0 }
                          }}
                        >
                          {/* button verifikasi */}
                          <CustomButton
                            bg={'#e3f2fd'}  // background
                            hover={'#1e88e5'} // color
                            color={'#1e88e5'}  // background ketika hover
                            label={<IconArrowNarrowRight style={{ fontSize: '18px' }} />} // icon 
                            onClick={() => func.handleApprove(row.id)}
                          />
                          {/* button edit status */}
                          <CustomButton
                            bg={'#fff8e1'}  // background
                            color={'#ffc107'} // color
                            hover={'#ffc107'} // background ketika hover
                            label={<CreateIcon style={{ fontSize: '18px' }} />}
                            onClick={() => func.handleEditStatus(row.id)}
                          />
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* pagination */}
      <Card sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 } }}>
        <Stack sx={{ justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Poppins
            sx={{
              order: { xs: 2, md: 1 },
              // alignSelf: { xs: 'flex-start', md: 'flex-end' },
              textAlign: 'center'
            }}
          >
            Menampilkan 1 - {value.itemsPerPage} dari {value.totalItems} Data
            {/* Menampilkan 1 - 10 dari {value.totalItems} Data */}
          </Poppins>
          {/* pagination */}
          <ThemeProvider theme={themePagination}>
            <Pagination
              sx={{ order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(value.totalItems / value.itemsPerPage)}
              page={value.page}
              onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
      {/* modal edit */}
      <CustomModal open={value.modal.data}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* title pilih status */}
            <Poppins sx={{ fontWeight: 500 }}>* Pilih Status</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Hadir', 'Terlambat']}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '12px',
                fontFamily: `'Poppins', sans-serif`
              }}
              value={value.newStatus || ''}
              onChange={func.handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="status"
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }
                  }}
                  placeholder={'Pilih Status'}
                />
              )}
            />
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={func.handleSave}>
            Simpan
            {value.loading === true && (
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
      {/* modal cetak laporan */}
      <CustomModal open={value.modal.cetak} handleClose={func.handleCloseModal}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* pilih bulan */}
            <Poppins sx={{ fontWeight: 500 }}>* Pilih Bulan</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={[
                'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember'
              ]}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '12px',
                fontFamily: `'Poppins', sans-serif`
              }}
              value={value.paramsCetak.bulan || ''}
              onChange={func.handleChangeBulan}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="bulan"
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }
                  }}
                  placeholder={'Pilih Bulan'}
                />
              )}
            />
            {/* tahun */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Masukkan Tahun</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              type="number"
              size="small"
              placeholder="Masukkan Tahun"
              name="tahun"
              value={value.paramsCetak.tahun}
              onChange={func.handleChangeTahun}
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={func.handleCetak}>
            Cetak
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
          <Poppins sx={{ fontWeight: 400 }}>Berhasil Menyimpan Data</Poppins>
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
