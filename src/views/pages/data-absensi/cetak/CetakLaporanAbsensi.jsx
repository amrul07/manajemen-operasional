import { Box, Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import { dataCetakAbsensi } from '../../../../utils/constan';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';

export default function CetakLaporanAbsensi() {
      useEffect(() => {
      const timeout = setTimeout(() => {
        const element = document.getElementById("print-content");
        if (!element) return;

        const opt = {
          margin:       10,
          filename:     'laporan-absensi.pdf',
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
          <Poppins sx={{ mt: 2 }}>Laporan Absensi</Poppins>
          <Poppins sx={{ mt: 1 }}>Bulan : Desember 2025</Poppins>
        </Stack>
        {/* tabel absensi */}
        <TableContainer sx={{ fontFamily: "`'Poppins', sans-serif`", mt: 2 }} component={Paper}>
          <Table>
            <TableHead sx={{ fontFamily: "`'Poppins', sans-serif`", backgroundColor: '#1e88e5',color: "#fff" }}>
              {/*  */}
              <TableRow sx={{ }}>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>No</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Nama</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Jabatan </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Kehadiran</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Izin</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Sakit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {dataCetakAbsensi.map((row) => {
                return (
                  <StyledTableRowCetak key={row.id}>
                    <StyledTableCellCetak>{row.id}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.nama}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.jabatan}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.kehadiran}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.izin}</StyledTableCellCetak>
                    <StyledTableCellCetak>{row.sakit}</StyledTableCellCetak>
                  </StyledTableRowCetak>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* mengetahui */}
        <Stack sx={{ my: 12 }}>
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
