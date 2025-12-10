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
import { dataAbsensi, dataAbsensiSaya, dataUser } from '../../../utils/constan';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';
import CustomModal from '../../../ui-component/modal/CustomModal';
import IconImage from '../../../assets/image.svg';
import Sukses from '../../../assets/sukses.svg';

export default function RiwayatAbsensi() {
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
                    value={'Desember 2025'}
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
                {/* <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", width: '350px' }}>No. HP</TableCell>
                <TableCell
                  sx={{
                    fontFamily: "`'Poppins', sans-serif`",
                    width: '170px',
                    textAlign: 'center'
                  }}
                >
                  Aksi
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataAbsensiSaya.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.nomor}</StyledTableCell>
                    <StyledTableCell>{row.Tanggal}</StyledTableCell>
                    <StyledTableCell>{row.status}</StyledTableCell>
                    {/* button absen masuk */}
                    <StyledTableCell>
                      <ButtonStyle
                        bg={'#27c100ff'}
                        color={'#fff'}
                        hover={'#209005ff'}
                        // onClick={() => func.handleEdit(row.id)}
                      >
                        Isi Kehadiran
                      </ButtonStyle>
                    </StyledTableCell>
                    {/* button absen pulang */}
                    <StyledTableCell>
                      <ButtonStyle
                        bg={'#ffc107'}
                        color={'#fff'}
                        hover={'#dda706ff'}
                        // onClick={() => func.handleEdit(row.id)}
                      >
                        Isi Kehadiran
                      </ButtonStyle>
                    </StyledTableCell>
                    {/* button izin/sakit */}
                    <StyledTableCell>
                      <ButtonStyle
                        bg={'red'}
                        color={'#fff'}
                        hover={'#af0202ff'}
                        // onClick={() => func.handleEdit(row.id)}
                      >
                        Isi Kehadiran
                      </ButtonStyle>
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
              sx={{ color: '#FFC400', order: { xs: 1, md: 2 }, alignSelf: 'center' }}
              count={Math.ceil(50 / 10)}
              // count={Math.ceil(value.totalItems / 10)}
              // page={value.page}
              // onChange={func.handleChangePage}
            />
          </ThemeProvider>
        </Stack>
      </Card>
      {/* modal izin/sakit */}
      <CustomModal open={false} handleClose={''}>
        <Grid container spacing={2}>
          <Grid item size={12}>
            {/* Alasan tidak hadir */}
            <Poppins sx={{ fontWeight: 500 }}>* Alasan Tidak Hadir</Poppins>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Izin', 'Sakit']}
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
                  placeholder={'Masukkan Alasan'}
                />
              )}
            />
            {/* bukti */}
            <Poppins sx={{ fontWeight: 500, mt: 2 }}>* Bukti</Poppins>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Stack
                sx={{
                  border: '1px dashed #576974',
                  borderRadius: '8px',
                  width: { xs: '50%', md: '45%' },
                  mt: 1
                }}
              >
                <img
                  src={IconImage}
                  width={50}
                  style={{
                    // width: "50px",
                    // margin: "0 auto",
                    margin: 'auto',
                    marginTop: '22px'
                  }}
                  alt="ta"
                />
                <Poppins
                  sx={{
                    width: '80%',
                    alignSelf: 'center',
                    color: '#576974',
                    textAlign: 'center'
                  }}
                >
                  Tarik dan lepas foto di sini
                </Poppins>

                <ButtonStyle
                  mt={'20px'}
                  // mb={"20px"}
                  width={'100%'}
                  height={'35px'}
                  bg={'#1e88e5'}
                  color={'#fff'}
                  hover={'#1b71bcff'}
                  // onClick={func.handleChooseFileClick}
                  // value={value.image}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    // onChange={func.handleImageChange}
                    // value={value.image}
                  />
                  Pilih File
                </ButtonStyle>
              </Stack>
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                {/* {value.previewImage ? (
                    <Stack sx={{ position: 'relative' }}>
                      <Image style={{ borderRadius: '8px' }} src={value.previewImage} alt={value.title} width={200} height={200} />
                      <Stack
                        sx={{
                          position: 'absolute',
                          alignSelf: 'end',
                          cursor: 'pointer',
                          p: 1
                        }}
                      >
                        <RiDeleteBin5Fill onClick={func.removeImage} color="red" size={'20px'} />
                      </Stack>
                    </Stack>
                  ) : (
                    <p style={{ fontFamily: `'Poppins', sans-serif` }}></p>
                  )} */}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        {/* button */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: 2, mt: 4 }}>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Kirim
          </ButtonStyle>
          <ButtonStyle width={'45%'} bg={'red'} color={'#fff'} hover={'#af0202ff'}>
            Batal
          </ButtonStyle>
        </Stack>
      </CustomModal>
      {/* modal succes */}
      <CustomModal open={false} handleClose={''}>
        <Stack sx={{ alignItems: 'center', gap: 2 }}>
          <img src={Sukses} alt="sukses" style={{ width: '145px', height: '145px' }} />
          <Poppins sx={{ fontSize: '24px', fontWeight: 600 }}>Sukses!</Poppins>
          <Poppins sx={{ fontWeight: 400 }}>Anda Berhasil Absen</Poppins>
          <ButtonStyle width={'45%'} height={'40px'} bg={'#1e88e5'} color={'#fff'} hover={'#1b71bcff'}>
            Kembali
          </ButtonStyle>
        </Stack>
      </CustomModal>
    </Card>
  );
}
