import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
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
  ThemeProvider,
  Typography
} from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from '../../../ui-component/table/StyledTableCell';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { themePagination } from '../../../ui-component/pagination/Pagination';
import { dataAbsensi, dataUser, menuItem } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CustomModal from '../../../ui-component/modal/CustomModal';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import Sukses from '../../../assets/sukses.svg';
import { IconExclamationCircle } from '@tabler/icons-react';
import UserLogic from './UserLogic';

export default function User() {
  const { value, func } = UserLogic();
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
                {/* dropdown tampilan .. data */}
                <TableCell
                  colSpan={3}
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
                {/* button tambah data */}
                <TableCell
                  colSpan={2}
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
              <TableRow>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nomor</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    width: '400px'
                  }}
                >
                  Nama Lengkap
                </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '350px' }}>jabatan</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '350px' }}>No. HP</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    width: '170px',
                    textAlign: 'center'
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
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>{row.jabatan}</StyledTableCell>
                      <StyledTableCell>{row.no_hp}</StyledTableCell>
                      <StyledTableCell>
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            gap: { xs: 1, md: 0 }
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
              sx={{ color: '#FFC400', order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(value.totalItems / value.itemsPerPage)}
              page={value.page}
              onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
      {/* modal tambah/edit data */}
      <CustomModal open={value.modal.data} handleClose={func.handleCloseModal}>
        <Grid container spacing={2}>
          <Grid item size={12}>
            {/* nama */}
            <Poppins sx={{ fontWeight: 500 }}>* Nama Lengkap</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Nama Lengkap"
              name="name"
              value={value.newData.name}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* no hp */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* No.HP</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Nomor HP"
              name="noHp"
              value={value.newData.noHp}
              onChange={func.handleChange}
            ></OutlinedInput>
            {/* jabatan */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Jabatan</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa']}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '12px',
                fontFamily: `'Poppins', sans-serif`
              }}
              value={value.newData.jabatan || null}
              onChange={func.handleChangeJabatan}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="jabatan"
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }
                  }}
                  placeholder={'Pilih Jabatan'}
                />
              )}
            />
            {/* password */}
            <Poppins sx={{ fontWeight: 500, mt: 2, display: value.editMode ? 'none' : 'flex' }}>* Password</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px',
                display: value.editMode ? 'none' : 'flex'
              }}
              size="small"
              name="password"
              value={value.newData.password}
              onChange={func.handleChange}
              placeholder="Masukkan Password"
              id="outlined-adornment-password"
              type={value.showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={func.handleShowPassword}
                    onMouseDown={func.handleMouseDownPassword}
                    edge="end"
                  >
                    {value.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} onClick={func.handleSave}>
            Simpan{' '}
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
            Iya{' '}
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
        <Alert onClose={func.closeSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontFamily: 'myFont' }}>
          {value.snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
