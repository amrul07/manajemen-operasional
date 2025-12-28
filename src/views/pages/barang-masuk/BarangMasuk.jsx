import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
  InputAdornment,
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
import { dataAbsensi, dataBarangMasuk, dataPermitaanBarang, dataStok, menuItem } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconExclamationCircle, IconPrinter, IconShoppingCartPlus, IconTrash } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import BarangMasukLogic from './BarangMasukLogic';
import Sukses from '../../../assets/sukses.svg';
import useGlobalStore from '../../../store/globalStore';

export default function BarangMasuk() {
  const { value, func } = BarangMasukLogic();
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
                  colSpan={role === 'Karyawan Biasa' || role === 'Karyawan Pelapor' ? 10 : 4}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`"
                  }}
                >
                  <Select
                    size="small"
                    value={value.itemsPerPage}
                    onChange={(e) => func.handleChangeItemsPerPage(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ mt: '5px', fontFamily: `'Poppins', sans-serif`, width: '180px' }}
                  >
                    {menuItem.map((res) => (
                      // title
                      <MenuItem sx={{ fontFamily: `'Poppins', sans-serif` }} value={res.value}>
                        {res.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                {/* button tambah */}
                <TableCell
                  colSpan={4}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    textAlign: 'end',
                    display: role === 'Karyawan Biasa' || role === 'Karyawan Pelapor' ? 'none' : '-moz-initial' // validasi hak akses(jika role nya karyawan pelapor/biasa maka button tambah tidak tampil)
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      mt: '5px',
                      backgroundColor: '#1e88e5', // background
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
                    onClick={func.handleModal}
                  >
                    <AddBoxIcon /> {/* icon button */}
                    {/* title button */}
                    <Poppins sx={{ fontWeight: 500 }}>Tambah Data </Poppins>
                  </Button>
                </TableCell>
              </TableRow>
              {/*  */}
              <TableRow sx={{}}>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>No</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Kode Barang </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Harga Jual</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Jumlah Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Sub Kategori</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tanggal Masuk</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    textAlign: 'center',
                    display: role === 'Karyawan Biasa' || role === 'Karyawan Pelapor' ? 'none' : '-moz-initial'
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
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
                      <StyledTableCell>{row.kode_barang}</StyledTableCell>
                      <StyledTableCell>{row.nama}</StyledTableCell>
                      <StyledTableCell>Rp.{row.harga}</StyledTableCell>
                      <StyledTableCell>{row.jumlah}</StyledTableCell>
                      <StyledTableCell>{row.sub_kategori}</StyledTableCell>
                      <StyledTableCell>{row.tanggal_masuk}</StyledTableCell>
                      <StyledTableCell sx={{ display: role === 'Karyawan Biasa' || role === 'Karyawan Pelapor' ? 'none' : '-moz-initial' }}>
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            gap: { xs: 1, md: 0 },
                            alignItems: 'center'
                          }}
                        >
                          {/* button lapor */}
                          <CustomButton
                            bg={'#e3f2fd'} // background
                            color={'#1e88e5'} // color
                            hover={'#1e88e5'} // background ketika hover
                            label={<IconPrinter size={18} />} // icon
                            onClick={() => func.handlePrint(row.id)}
                          />
                          {/* button edit */}
                          <CustomButton
                            bg={'#fff8e1'} // background
                            color={'#ffc107'} // color
                            hover={'#ffc107'} // background ketika hover
                            label={<CreateIcon style={{ fontSize: '18px' }} />} // icon
                            onClick={() => func.handleEdit(row.id)}
                          />
                          {/* hapus */}
                          <CustomButton
                            bg={'#FFD5CC'} // background
                            color={'red'} // color
                            hover={'red'} // background ketika hover
                            label={<DeleteOutlineIcon style={{ fontSize: '18px' }} />} // icon
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
          <Grid size={12}>
            {/* kode barang */}
            <Poppins sx={{ fontWeight: 500 }}>* Kode Barang</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Kode Barang"
              name="kode_barang"
              value={value.newData.kode_barang}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Nama Barang */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Nama Barang</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Nama Barang"
              name="nama"
              value={value.newData.nama}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Harga */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Harga</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              startAdornment={
                <InputAdornment sx={{ fontFamily: `'Poppins', sans-serif` }} position="start">
                  Rp.
                </InputAdornment>
              }
              placeholder="Masukkan Harga"
              name="harga"
              value={value.newData.harga}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Jumlah Barang */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Jumlah Barang</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Jumlah Barang"
              name="jumlah"
              value={value.newData.jumlah}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Sub Kategori */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Sub Kategori</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Sub Kategori"
              name="sub_kategori"
              value={value.newData.sub_kategori}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Tanggal Masuk */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Tanggal Masuk</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Contoh: 31-12-2025"
              name="tanggal_masuk"
              value={value.newData.tanggal_masuk}
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
