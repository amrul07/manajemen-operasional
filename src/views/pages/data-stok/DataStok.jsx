import {
  Autocomplete,
  Button,
  Card,
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
import { dataAbsensi, dataStok } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconPrinter, IconShoppingCartPlus } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import Sukses from "../../../assets/sukses.svg"


export default function DataStok() {
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
                  colSpan={2}
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
              </TableRow>
              {/*  */}
              <TableRow sx={{}}>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>No</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Kode Barang </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Harga Barang</TableCell>
                {/* <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Stok</TableCell> */}
                {/* <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Stok Awal</TableCell> */}
                {/* <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tangggal Masuk</TableCell> */}
                {/* <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tangggal Update</TableCell> */}
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", textAlign: 'center' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataStok.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>{row.nama}</StyledTableCell>
                    <StyledTableCell>{row.kode}</StyledTableCell>
                    <StyledTableCell>Rp.{row.harga}</StyledTableCell>
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
                          gap: { xs: 1, md: 0 }
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
                        <CustomButton
                          bg={'#e3f2fd'}
                          hover={'#1e88e5'}
                          color={'#1e88e5'}
                          label={<VisibilityIcon style={{ fontSize: '18px' }} />}
                          // onClick={() =>
                          //   func.handleDetailClick(row.id)
                          // }
                        />
                        {/* )} */}
                        {/* button pemesanan */}
                        <CustomButton
                          bg={'#fff8e1'}
                          color={'#ffc107'}
                          hover={'#ffc107'}
                          label={<IconShoppingCartPlus size={18} style={{}} />}
                          // onClick={() => func.handleEdit(row.id)}
                        />
                        {/* <CustomButton
                          bg={'#FFD5CC'}
                          color={'red'}
                          hover={'red'}
                          label={<IconPrinter size={18} style={{}} />}
                          // onClick={() => func.openModalDelete(row.id)}
                        /> */}
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
      {/* modal pemesanan */}
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
      {/* modal succes */}
      <CustomModal open={false} handleClose={''}>
        <Stack sx={{ alignItems: 'center',gap:2 }}>
          <img src={Sukses} alt="sukses" style={{ width: '145px', height: '145px' }} />
          <Poppins sx={{fontSize: "24px",fontWeight: 600}}>Sukses!</Poppins>
          <Poppins sx={{fontWeight: 400}}>Pesanan Berhasil di Buat</Poppins>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Kembali
          </ButtonStyle>
        </Stack>
      </CustomModal>
    </Card>
  );
}
