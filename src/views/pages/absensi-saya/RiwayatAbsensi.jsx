import {
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
import { dataAbsensi, dataAbsensiSaya, dataUser, menuItem } from '../../../utils/constan';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import CustomModal from '../../../ui-component/modal/CustomModal';
import IconImage from '../../../assets/image.svg';
import Sukses from '../../../assets/sukses.svg';
import AbsensiSayaLogic from './AbsensiSayaLogic';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function RiwayatAbsensi() {
  const { value, func } = AbsensiSayaLogic();
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
                {/* button absensi saya */}
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
                      backgroundColor: '#1e88e5', // background
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
                    <AddBoxIcon /> {/* icon button */}
                    {/* title button */}
                    <Poppins sx={{ fontWeight: 500 }}>Absensi Saya</Poppins>
                  </Button>
                </TableCell>
              </TableRow>
              {/*  */}
              <TableRow>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nomor</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    width: '200px'
                  }}
                >
                  Hari/Tanggal
                </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '350px' }}>Status</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '450px' }}>Absen Masuk</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '450px' }}>Absen Pulang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '450px' }}>Izin/Sakit</TableCell>
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
                      <StyledTableCell>{row.tanggal}</StyledTableCell>
                      <StyledTableCell>{row.status}</StyledTableCell>
                      <StyledTableCell>{row.waktu_checkin}</StyledTableCell>
                      <StyledTableCell>{row.waktu_checkout}</StyledTableCell>
                      <StyledTableCell>{row.izin_sakit}</StyledTableCell>
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
              sx={{ color: '#FFC400', order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(value.totalItems / value.itemsPerPage)}
              page={value.page}
              onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
    </Card>
  );
}
