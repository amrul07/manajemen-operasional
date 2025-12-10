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
import { dataAbsensi } from '../../../utils/constan';
import CustomButton from '../../../ui-component/button/CustomButton';
import { IconArrowBadgeRight, IconArrowBigRight, IconArrowNarrowRight, IconPrinter } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../ui-component/modal/CustomModal';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import Sukses from '../../../assets/sukses.svg';
import CreateIcon from '@mui/icons-material/Create';

export default function DataAbsensi() {
  const router = useNavigate();
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
                    value={'30 Desember 2025'}
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
              <TableRow>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nomor</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Nama </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`" }}>Status</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    textAlign: 'center'
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataAbsensi.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.nomor}.</StyledTableCell>
                    <StyledTableCell>{row.nama}</StyledTableCell>
                    <StyledTableCell>{row.tanggal}</StyledTableCell>
                    <StyledTableCell>
                      <Stack
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          gap: { xs: 1, md: 0 }
                        }}
                      >
                        {/* button verifikasi */}
                        <CustomButton
                          bg={'#e3f2fd'}
                          hover={'#1e88e5'}
                          color={'#1e88e5'}
                          label={<IconArrowNarrowRight style={{ fontSize: '18px' }} />}
                          onClick={() => router(`/data-absensi/detail/${row.id}`)}
                        />
                        {/* button pemesanan */}
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
              sx={{ order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(50 / 10)}
              // count={Math.ceil(value.totalItems / 10)}
              // page={value.page}
              // onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
      {/* modal edit */}
      <CustomModal open={false}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Poppins sx={{ fontWeight: 500 }}>* Pilih Status</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Hadir', 'Terlambat']}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '12px',
                fontFamily: `'Poppins', sans-serif`
              }}
              // value={value.newData.jabatan || null}
              // onChange={func.handleChangeJabatan}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="jabatan"
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }
                  }}
                  placeholder={'Pilih Status'}
                />
              )}
            />
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
      {/* modal cetak laporan */}
      <CustomModal open={false} handleClose={''}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* pilih bulan */}
            <Poppins sx={{ fontWeight: 500 }}>* Pilih Bulan</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={[
                'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember'
              ]}
              size="small"
              sx={{
                mt: '5px',
                borderRadius: '12px',
                fontFamily: `'Poppins', sans-serif`
              }}
              // value={value.newData.jabatan || null}
              // onChange={func.handleChangeJabatan}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="jabatan"
                  sx={{ fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontFamily: `'Poppins', sans-serif`, borderRadius: '12px' }
                  }}
                  placeholder={'Pilih Bulan'}
                />
              )}
            />
            {/* tahun */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Masukkan Tahun</Poppins>
            <OutlinedInput
              sx={{
                mt: 1,
                fontFamily: `'Poppins', sans-serif`,
                width: '100%',
                borderRadius: '12px'
              }}
              size="small"
              placeholder="Masukkan Tahun"
              // value={value.name}
              // onChange={(e) => value.setName(e.target.value)}
            ></OutlinedInput>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Cetak
          </ButtonStyle>
          <ButtonStyle width={'45%'} bg={'red'} color={'#fff'} hover={'#af0202ff'}>
            Batal
          </ButtonStyle>
        </Stack>
      </CustomModal>
    </Card>
  );
}
