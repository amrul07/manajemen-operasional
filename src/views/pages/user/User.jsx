import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Pagination,
  Paper,
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
import { dataAbsensi, dataUser } from '../../../utils/constan';
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

export default function User() {
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
                  colSpan={3}
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`"
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    sx={{
                      mt: '5px',
                      borderRadius: '12px',
                      fontFamily: `'Poppins', sans-serif`,
                      width: '180px'
                    }}
                    clearIcon={true}
                    // options={value.kabinet || []}
                    // value={
                    //   (value.kabinet &&
                    //     value.kabinet.find(
                    //       (option) => option.id === value.cabinet
                    //     )) ||
                    //   value.cabinet
                    value={'Tampilkan 10 data'}
                    // }
                    // onChange={(event, v) => {
                    //   value.setCabinet(v ? v.id : "");
                    // }}
                    // getOptionLabel={(option) => option.name || value.cabinet}
                    // isOptionEqualToValue={(option, value) =>
                    //   option.id === value.id
                    // }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          fontFamily: `'Poppins', sans-serif`,
                          borderRadius: '12px'
                        }}
                        // InputProps={{
                        //   ...params.InputProps,
                        //   style: { fontFamily: `'Poppins', sans-serif` },
                        // }}
                        // placeholder={"Pilih Periode Kepengurusan"}
                      />
                    )}
                  />
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
                    // onClick={onClick}
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
              {dataUser.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>{row.nama}</StyledTableCell>
                    <StyledTableCell>{row.jabatan}</StyledTableCell>
                    <StyledTableCell>{row.noHp}</StyledTableCell>
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
                          // onClick={() => func.handleEdit(row.id)}
                        />
                        {/* button delete */}
                        <CustomButton
                          bg={'#FFD5CC'}
                          color={'red'}
                          hover={'red'}
                          label={<DeleteOutlineIcon style={{ fontSize: '18px' }} />}
                          // onClick={() => func.openModalDelete(row.id)}
                        />
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
            Menampilkan 1 - 10 dari 10 Data
            {/* Menampilkan 1 - 10 dari {value.totalItems} Data */}
          </Poppins>
          {/* pagination */}
          <ThemeProvider theme={themePagination}>
            <Pagination
              sx={{ color: '#FFC400', order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(50 / 10)}
              // count={Math.ceil(value.totalItems / 10)}
              // page={value.page}
              // onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
      {/* modal tambah/edit data */}
      <CustomModal open={false} handleClose={''}>
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
            ></OutlinedInput>
            {/* jabatan */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Jabatan</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Pimpinan', 'Staf', 'Karyawan - Pelapor', 'Karyawan - Biasa']}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '12px',
                fontFamily: `'Poppins', sans-serif`
              }}
              // value={value.gender}
              onChange={(event, v) => {
                value.setGender(v);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif` }
                  }}
                  placeholder={'Pilih Jenis Kelamin'}
                />
              )}
            />
            {/* password */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Password</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
                // display: value.editMode ? "none" : "flex",
              }}
              // value={value.password}
              // onChange={(e) => value.setPassword(e.target.value)}
              placeholder="Masukkan Password"
              name="password"
              id="outlined-adornment-password"
              // type={value.showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    // onClick={func.handleShowPassword}
                    // onMouseDown={func.handleMouseDownPassword}
                    edge="end"
                  >
                    {/* {value.showPassword ? <Visibility /> : <VisibilityOff />} */}
                  </IconButton>
                </InputAdornment>
              }
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'} label={'Simpan'} />
          <ButtonStyle width={'45%'} bg={'red'} color={'#fff'} hover={'#af0202ff'} label={'Batal'} />
        </Stack>
      </CustomModal>
      {/* modal succes */}
      <CustomModal open={false} handleClose={''}>
        <Stack sx={{ alignItems: 'center', gap: 2 }}>
          <img src={Sukses} alt="sukses" style={{ width: '145px', height: '145px' }} />
          <Poppins sx={{ fontSize: '24px', fontWeight: 600 }}>Sukses!</Poppins>
          <Poppins sx={{ fontWeight: 400 }}>Berhasil Menambahkan Data</Poppins>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Kembali
          </ButtonStyle>
        </Stack>
      </CustomModal>
      {/* modal hapus */}
      <CustomModal open={false} handleClose={''}>
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
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Iya
          </ButtonStyle>
          <ButtonStyle width={'45%'} bg={'red'} color={'#fff'} hover={'#af0202ff'}>
            Batal
          </ButtonStyle>
        </Stack>
      </CustomModal>
    </Card>
  );
}
