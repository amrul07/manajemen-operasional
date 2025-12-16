import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Checkbox,
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
import { dataAbsensi, dataBarangKeluar, dataBarangMasuk, dataPermitaanBarang, dataStok, menuItem } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconExclamationCircle, IconPrinter, IconShoppingCartPlus, IconTrash } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import BarangKeluarLogic from './BarangKeluarLogic';

export default function BarangKeluar() {
  const { value, func } = BarangKeluarLogic();
  return (
    // {/* tabel */}
    <Card sx={{ mt: 2 }}>
      <div id="print-content">
        <TableContainer sx={{ px: 5, fontFamily: "`'Poppins', sans-serif`" }} component={Paper}>
          <Table>
            <TableHead sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              <TableRow>
                {/* dropdown tampilan .. data */}
                <TableCell
                  colSpan={4}
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
                      <MenuItem sx={{ fontFamily: `'Poppins', sans-serif` }} value={res.value}>
                        {res.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                {/* button tambah */}
                <TableCell
                  colSpan={5}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    textAlign: 'end'
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
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Kode Barang </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Harga Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tanggal Keluar</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Sub Kategori</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Toko Tujuan</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Jumlah Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", textAlign: 'center' }}>Aksi</TableCell>
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
                      <StyledTableCell>{row.tanggal_keluar}</StyledTableCell>
                      <StyledTableCell>{row.sub_kategori}</StyledTableCell>
                      <StyledTableCell>{row.toko_tujuan}</StyledTableCell>
                      <StyledTableCell>{row.jumlah}</StyledTableCell>
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
                          {/* button edit */}
                          <CustomButton
                            bg={'#fff8e1'}
                            color={'#ffc107'}
                            hover={'#ffc107'}
                            label={<CreateIcon style={{ fontSize: '18px' }} />}
                            onClick={() => func.handleEdit(row.id)}
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
      </div>
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
            <Select
              size="small"
              value={value.dataDropdown?.barang_id || ''}
              onChange={func.handleChangeDropdown}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ mt: '5px', fontFamily: `'Poppins', sans-serif` }}
              fullWidth
              disabled={value.editMode ? true : false}
            >
              {/* placeholder */}
              <MenuItem value="" disabled sx={{ fontFamily: `'Poppins', sans-serif` }}>
                Silahkan pilih kode barang
              </MenuItem>
              {value.dataStock &&
                value.dataStock.map((res) => (
                  <MenuItem sx={{ fontFamily: `'Poppins', sans-serif` }} value={res.id}>
                    {res.nama} - {res.kode_barang}
                  </MenuItem>
                ))}
            </Select>
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
              // name=''
              value={value.dataDropdown?.nama || ''}
              // onChange={(e) => value.setName(e.target.value)}
              disabled
            ></OutlinedInput>
            {/* Harga */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Harga Barang</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Harga"
              value={value.dataDropdown?.harga || ''}
              // onChange={(e) => value.setName(e.target.value)}
              disabled
            ></OutlinedInput>
            {/* Tanggal Keluar */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Tanggal Keluar</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Tanggal Keluar"
              name="tanggal_keluar"
              value={value.newData.tanggal_keluar}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* Toko Tujuan */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Toko Tujuan</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Toko Tujuan"
              name="toko_tujuan"
              value={value.newData.toko_tujuan}
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
