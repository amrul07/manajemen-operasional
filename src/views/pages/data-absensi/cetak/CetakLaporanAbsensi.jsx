import { Box, Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import { dataCetakAbsensi } from '../../../../utils/constan';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';
import { useParams } from 'react-router-dom';
import { set, get } from 'idb-keyval';
import { fetchData } from '../../../../api/api';

export default function CetakLaporanAbsensi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tahun, bulan } = useParams();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      handlePrint();
    }
  }, [loading, data]);

  // get data
  const getData = async () => {
    setLoading(true);
    try {
      if (navigator.onLine) {
        // ONLINE → Ambil dari API
        const res = await fetchData(`/data-absensi/rekap-absensi-by-bulan?year=${tahun}&month=${bulan}`);
        const detail = res.data;

        setData(detail);

        // simpan ke IndexedDB
        await set(`cetakAbsensi-${tahun}-${bulan}`, detail);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cached = await get(`cetakAbsensi-${tahun}-${bulan}`);

        if (cached) {
          setData(cached);
        } else {
          setData({ error: 'Data tidak tersedia offline' });
        }
      }
    } catch (err) {
      console.log('Error load:', err);

      // Jika error API → coba fallback ke IndexedDB
      const cached = await get(`cetakAbsensi-${tahun}-${bulan}`);
      if (cached) {
        setData(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  // handle print
  const handlePrint = () => {
    const element = document.getElementById('print-content');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `rekap absensi ${bulan} ${tahun}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };
  return (
    <div id="print-content">
      {data?.error && <Poppins style={{ color: 'red' }}>{data.error}</Poppins>}
      <Card sx={{ p: 4 }}>
        <Stack>
          <Poppins sx={{ fontWeight: 700, textAlign: 'center' }}>CV. INDO RETAIL ABADI</Poppins>
          <Poppins sx={{ mt: 2 }}>Laporan Absensi</Poppins>
          <Poppins sx={{ mt: 1 }}>
            Bulan : {bulan} {tahun}
          </Poppins>
        </Stack>
        {/* tabel absensi */}
        <TableContainer sx={{ fontFamily: "`'Poppins', sans-serif`", mt: 2 }} component={Paper}>
          <Table>
            <TableHead sx={{ fontFamily: "`'Poppins', sans-serif`", backgroundColor: '#1e88e5', color: '#fff' }}>
              {/*  */}
              <TableRow sx={{}}>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>No</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Nama</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Jabatan </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Kehadiran</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Izin</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Sakit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {data.length === 0 &&(
                 <StyledTableRowCetak>
                  <StyledTableCellCetak colSpan={5}>Tidak ada data</StyledTableCellCetak>
                </StyledTableRowCetak>
              )}
              {loading ? (
                <StyledTableRowCetak>
                  <StyledTableCellCetak colSpan={5}>Loading...</StyledTableCellCetak>
                </StyledTableRowCetak>
              ) : (
                data &&
                data.map((row, i) => {
                  return (
                    <StyledTableRowCetak key={row.id}>
                      <StyledTableCellCetak>{i + 1}</StyledTableCellCetak>
                      <StyledTableCellCetak>{row.nama}</StyledTableCellCetak>
                      <StyledTableCellCetak>{row.jabatan}</StyledTableCellCetak>
                      <StyledTableCellCetak>{row.hadir}</StyledTableCellCetak>
                      <StyledTableCellCetak>{row.izin}</StyledTableCellCetak>
                      <StyledTableCellCetak>{row.sakit}</StyledTableCellCetak>
                    </StyledTableRowCetak>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* mengetahui */}
        <Stack sx={{ mt: 12, height: '200px', width: '95%', justifySelf: 'center' }}>
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
