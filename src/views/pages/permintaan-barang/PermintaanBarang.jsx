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
import { dataAbsensi, dataPermitaanBarang, dataStok } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconExclamationCircle, IconPrinter, IconShoppingCartPlus, IconTrash } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

export default function PermintaanBarang() {
  return (
    // {/* tabel */}
    <Card sx={{ mt: 2 }}>
      <div id="print-content">
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
                    // onClick={onClick}
                  >
                    <IconPrinter />
                    <Poppins sx={{ fontWeight: 500 }}>Cetak Laporan</Poppins>
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
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Jumlah Permintaan </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tanggal Permintaan</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Modal</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nomor Npwp Gudang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", textAlign: 'center' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataPermitaanBarang.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>{row.nama}</StyledTableCell>
                    <StyledTableCell>{row.jumlah}</StyledTableCell>
                    <StyledTableCell>{row.tanggalPermintaan}</StyledTableCell>
                    <StyledTableCell>Rp.{row.modal}</StyledTableCell>
                    <StyledTableCell>{row.no}</StyledTableCell>
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
                        {/* {loadingDetail === true &&
                                value.selectedId === row.id ? (
                                  <CircularProgress
                                    size={"20px"}
                                    sx={{
                                      color: "#23176D",
                                    }}
                                  />
                                ) : ( */}
                        {/* <CustomButton
                          bg={'#e3f2fd'}
                          hover={'#1e88e5'}
                          color={'#1e88e5'}
                          label={<VisibilityIcon style={{ fontSize: '18px' }} />}
                          // onClick={() =>
                          //   func.handleDetailClick(row.id)
                          // }
                        /> */}
                        {/* )} */}
                        {/* button pemesanan */}
                        <CustomButton
                          bg={'#fff8e1'}
                          color={'#ffc107'}
                          hover={'#ffc107'}
                          label={<CreateIcon style={{ fontSize: '18px' }} />}
                          // onClick={() => func.handleEdit(row.id)}
                        />
                        <Checkbox
                          sx={{
                            '& .MuiSvgIcon-root': { fontSize: 38 },
                            color: '1e88e5',
                            '&.Mui-checked': {
                              color: '1e88e5'
                            }
                          }}
                        />
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              placeholder="Masukkan Tanggal Permintaan"
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              size="small"
              placeholder="Masukkan Modal"
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
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
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Pesan
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
