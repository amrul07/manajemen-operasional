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
import { dataAbsensi, dataLaporanBarangKeluar, dataLaporanBarangMasuk, dataPermitaanBarang, dataStok } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconExclamationCircle, IconPrinter, IconShoppingCartPlus, IconTrash } from '@tabler/icons-react';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CustomCheckBox from '../../../ui-component/checkbox/CustomCheckBox';

export default function LaporanBarangKeluar() {
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
                  colSpan={6}
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
                {/* button cetak */}
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
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Kode Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Harga Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Tanggal Keluar</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Sub Kategori </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Toko Tujuan</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Jumlah Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", textAlign: 'center' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataLaporanBarangKeluar.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>{row.kode}</StyledTableCell>
                    <StyledTableCell>{row.nama}</StyledTableCell>
                    <StyledTableCell>Rp.{row.harga}</StyledTableCell>
                    <StyledTableCell>{row.tanggalKeluar}</StyledTableCell>
                    <StyledTableCell>{row.kategori}</StyledTableCell>
                    <StyledTableCell>{row.toko}</StyledTableCell>
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
                        {/* buttom ceklis */}
                        <CustomCheckBox />
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
    </Card>
  );
}
