import {
  Box,
  Button,
  Card,
  InputBase,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, { useEffect } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import { dataBarangMasuk, dataCetakAbsensi, dataPermitaanBarang, dataStok } from '../../../../utils/constan';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';
import ButtonStyle from '../../../../ui-component/button/ButtonStyle';
import { IconPrinter } from '@tabler/icons-react';

export default function CetakBarangMasuk() {
  // ketika button di klik
  const handlePrint = () => {
    const element = document.getElementById('print-content');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'lapor barang.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Card sx={{ p: 4 }}>
      <div id="print-content">
        <Stack>
          <Poppins sx={{ fontWeight: 700, textAlign: 'center' }}>CV. INDO RETAIL ABADI</Poppins>
          <Poppins sx={{ mt: 2 }}>Lapor Barang</Poppins>
          <Poppins sx={{ mt: 1 }}>Tanggal : 25 Desember 2025</Poppins>
        </Stack>
        {/* tabel data */}
        <TableContainer sx={{ fontFamily: "`'Poppins', sans-serif`", mt: 2 }} component={Paper}>
          <Table>
            <TableHead sx={{ fontFamily: "`'Poppins', sans-serif`", backgroundColor: '#1e88e5', color: '#fff' }}>
              {/*  */}
              <TableRow sx={{}}>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>No</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Kode Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Harga </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Jumlah Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Sub Kategori</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Tanggal Masuk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataBarangMasuk.map((row) => {
                return (
                  <StyledTableRowCetak key={row.id}>
                    <StyledTableCellCetak>{row.id}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.kode}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.nama}</StyledTableCellCetak>
                    <StyledTableCellCetak>Rp.{row.harga}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.jumlah}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.kategori}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.tanggalMasuk}</StyledTableCellCetak>
                  </StyledTableRowCetak>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* alasan pelaporan barang */}
        <Stack mt={4} sx={{ p: 2, border: '2px solid #1e88e5', borderRadius: '12px' }}>
          <Poppins>Alasan Pelaporan Barang :</Poppins>
          <InputBase
            maxRows={15}
            // rows={4}
            multiline
            sx={{
              mt: 1,
              fontFamily: `'Poppins', sans-serif`,
              width: '100%'
            }}
            size="small"
            placeholder="Masukkan ALasan Pelaporan..."
          ></InputBase>
        </Stack>
        {/* mengetahui */}
        <Stack sx={{ mt: 12, height: '200px', width: '95%', justifySelf: 'center' }}>
          <Poppins>Mengetahui,</Poppins>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Poppins>Staf</Poppins>
            <Poppins>Pimpinan</Poppins>
          </Stack>
        </Stack>
      </div>

      {/* button cetak */}
      <Stack sx={{ float: 'right' }}>
        <Button
          variant="contained"
          sx={{
            mt: '5px',
            backgroundColor: '#1e88e5',
            color: '#FFFFFF',
            textTransform: 'none',
            gap: 1,
            px: 2,
            // width: '20%',
            height: '35px',
            transition: 'background-color 0.3s',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={handlePrint}
        >
          <IconPrinter />
          <Poppins sx={{ fontWeight: 500 }}>Cetak </Poppins>
        </Button>
      </Stack>
    </Card>
  );
}
