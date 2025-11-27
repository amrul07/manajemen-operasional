import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
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
  ThemeProvider
} from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from '../../../ui-component/table/StyledTableCell';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { themePagination } from '../../../ui-component/pagination/Pagination';
import { dataAbsensi, dataBarangKeluar, dataBarangMasuk, dataPermitaanBarang, dataStok } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconExclamationCircle, IconPrinter, IconShoppingCartPlus, IconTrash } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

export default function BarangKeluar() {
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
                    // onClick={onClick}
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
              {dataBarangKeluar.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>{row.kode}</StyledTableCell>
                    <StyledTableCell>{row.nama}</StyledTableCell>
                    <StyledTableCell>Rp.{row.harga}</StyledTableCell>
                    <StyledTableCell>{row.tanggalKeluar}</StyledTableCell>
                    <StyledTableCell>{row.kategori}</StyledTableCell>
                    <StyledTableCell>{row.tokoTujuan}</StyledTableCell>
                    <StyledTableCell>{row.jumlah}</StyledTableCell>
                    {/* <StyledTableCell>{row.stok}</StyledTableCell> */}
                    {/* <StyledTableCell>{row.stokAwal}</StyledTableCell> */}
                    {/* <StyledTableCell>{row.tanggalMasuk}</StyledTableCell> */}
                    {/* <StyledTableCell>{row.tanggalUpdate}</StyledTableCell> */}
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
                          // onClick={() => func.handleEdit(row.id)}
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
              sx={{ order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(50 / 10)}
              // count={Math.ceil(value.totalItems / 10)}
              // page={value.page}
              // onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
      {/* modal tambah/edit */}
      <CustomModal open={false} handleClose={''}>
        <Grid container spacing={2}>
          <Grid item size={12}>
            {/* kode barang */}
            <Poppins sx={{ fontWeight: 500 }}>* Kode Barang</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['12345', '6789', '101112', '131415']}
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
                  placeholder={'Pilih Kode Barang'}
                />
              )}
            />
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Simpan
          </ButtonStyle>
          <ButtonStyle width={'45%'} bg={'red'} color={'#fff'} hover={'#af0202ff'}>
            Batal
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
