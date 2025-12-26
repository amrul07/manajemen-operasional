import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
  InputAdornment,
  OutlinedInput,
  Pagination,
  Paper,
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
import { dataAbsensi, dataPermitaanBarang, dataStok } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconExclamationCircle, IconPrinter, IconShoppingCartPlus, IconTrash } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import Sukses from '../../../assets/sukses.svg';
import CustomCheckBox from '../../../ui-component/checkbox/CustomCheckBox';
import PermintaanBarangLogic from './PermitaanBarangLogic';

export default function PermintaanBarang() {
  const { value, func } = PermintaanBarangLogic();
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
                {/* button cetak  */}
                <TableCell
                  colSpan={4}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`"
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      mt: '5px',
                      backgroundColor: '#1e88e5',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      gap: 1,
                      px: 2,
                      height: '35px',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={func.handlePrint}
                  >
                    <IconPrinter />
                    <Poppins sx={{ fontWeight: 500 }}>Cetak Laporan</Poppins>
                    {value.loading === true && (
                      <CircularProgress
                        size={18}
                        sx={{
                          color: '#FFF'
                        }}
                      />
                    )}
                  </Button>
                </TableCell>
                {/* button tambah */}
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
                      backgroundColor: '#ffc107',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      gap: 1,
                      px: 2,
                      height: '35px',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={func.handleModal}
                  >
                    <AddBoxIcon />
                    <Poppins sx={{ fontWeight: 500 }}>Tambah Data</Poppins>
                  </Button>
                </TableCell>
              </TableRow>
              {/*  */}
              <TableRow sx={{}}>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>No</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Jumlah Permintaan </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tanggal Permintaan</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Modal</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nomor Npwp Gudang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", textAlign: 'center' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {value.loadingPagination ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={5}>Loading...</StyledTableCell>
                </StyledTableRow>
              ) : (
                value?.data.map((row, i) => {
                  return (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{(value.page - 1) * value.itemsPerPage + i + 1}</StyledTableCell>
                      <StyledTableCell>{row.nama_barang}</StyledTableCell>
                      <StyledTableCell>{row.jumlah_permintaan}</StyledTableCell>
                      <StyledTableCell>{row.tanggal_permintaan}</StyledTableCell>
                      <StyledTableCell>Rp.{row.modal}</StyledTableCell>
                      <StyledTableCell>{row.nomor_npwp}</StyledTableCell>
                      <StyledTableCell>
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            gap: { xs: 1, md: 0 },
                            alignItems: 'center'
                          }}
                        >
                          {/* buttom ceklis */}
                          {/* <CustomCheckBox onChange={() => func.handleCeklis(row.id)} checked={value.idPrint.includes(row.id)} /> */}
                          {/* button pemesanan */}
                          <CustomButton
                            bg={'#fff8e1'}
                            color={'#ffc107'}
                            hover={'#ffc107'}
                            label={<CreateIcon style={{ fontSize: '18px' }} />}
                            onClick={() => func.handleEdit(row.id)}
                          />
                          {/* button delete */}
                          <CustomButton
                            bg={'#FFD5CC'}
                            color={'red'}
                            hover={'red'}
                            label={<DeleteOutlineIcon style={{ fontSize: '18px' }} />}
                            onClick={() => func.openModalDelete(row.id)}
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
      {/* modal tambah/edit */}
      <CustomModal open={value.modal.data} handleClose={func.handleCloseModal}>
        <Grid container spacing={2}>
          <Grid item size={12}>
            {/* nama barang */}
            <Poppins sx={{ fontWeight: 500 }}>* Nama Barang</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Nama Barang"
              name="nama_barang"
              value={value.newData.nama_barang}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* tanggal permintaan */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Tanggal Permintaan</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Contoh: 31-12-2025"
              name="tanggal_permintaan"
              value={value.newData.tanggal_permintaan}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* jumlah permintaan */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Jumlah Permintaan</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Jumlah Permintaan"
              name="jumlah_permintaan"
              value={value.newData.jumlah_permintaan}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Modal */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Modal</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              startAdornment={
                <InputAdornment sx={{ fontFamily: `'Poppins', sans-serif` }} position="start">
                  Rp.
                </InputAdornment>
              }
              size="small"
              placeholder="Masukkan Modal"
              name="modal"
              value={value.newData.modal}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Nomor Npwp Gudang */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Nomor Npwp Gudang</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Nomor Npwp Gudang"
              name="nomor_npwp"
              value={value.newData.nomor_npwp}
              onChange={func.handleChange}
            ></OutlinedInput>
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
      {/* modal hapus */}
      <CustomModal open={value.modal.delete} handleClose={func.handleCloseModal}>
        <Stack sx={{ alignItems: 'center', gap: 2 }}>
          <Stack
            sx={{
              backgroundColor: 'red',
              borderRadius: '50%',
              width: '145px',
              height: '145px'
              // alignSelf: 'center'
            }}
          >
            <IconExclamationCircle size={100} color="#fff" style={{ margin: 'auto' }} />
          </Stack>
          {/* <Poppins sx={{ fontSize: '24px', fontWeight: 600 }}>Sukses!</Poppins> */}
          <Poppins sx={{ fontWeight: 400 }}>Anda Yakin Ingin Menghapus?</Poppins>
        </Stack>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={func.handleDelete}>
            Iya
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
