import { Box, Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import { dataBarangMasuk, dataCetakAbsensi, dataPermitaanBarang, dataStok } from '../../../../utils/constan';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';

export default function CetakBarangMasuk() {
      useEffect(() => {
      const timeout = setTimeout(() => {
        const element = document.getElementById("print-content");
        if (!element) return;

        const opt = {
          margin:       10,
          filename:     'barang masuk.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
      }, 1000); // delay biar UI sempat render

      return () => clearTimeout(timeout);
    }, []);
  return (
    <div id="print-content">
      <Card sx={{ p: 4 }}>
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
          <Poppins>
            Berikut kami sampaikan laporan barang masuk yang diterima pada tanggal 25 Desember 2025. Seluruh barang yang masuk telah dicatat
            dan diperiksa secara menyeluruh oleh petugas gudang untuk memastikan kondisi barang sesuai dengan pesanan dan tidak mengalami
            kerusakan. Laporan ini berisi informasi mulai dari kode barang, nama barang, harga, jumlah yang diterima, hingga kategori barang
            untuk memudahkan proses identifikasi dan pengelompokkan
          </Poppins>
        </Stack>
        {/* mengetahui */}
        <Stack sx={{ mt: 12, height: '200px', width: '95%', justifySelf: "center", }}>
          <Poppins>Mengetahui,</Poppins>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Poppins>Staf</Poppins>
            <Poppins>Pimpinan</Poppins>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}
