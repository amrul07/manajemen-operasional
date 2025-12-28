import { Box, Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import { dataBarangMasuk, dataCetakAbsensi, dataLaporanBarangMasuk, dataPermitaanBarang, dataStok } from '../../../../utils/constan';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';
import { set, get } from 'idb-keyval';
import { useSearchParams } from 'react-router-dom';
import { fetchData, postData } from '../../../../api/api';
import { useLocation } from 'react-router-dom';

export default function CetakLaporanBarangMasuk() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const printedRef = useRef(false);
  const ids = location.state?.ids || [];

  useEffect(() => {
    setData([]); // ⬅️ RESET DATA LAMA
    setLoading(true); // ⬅️ RESET LOADING

    if (ids.length > 0) {
      getData();
    }
  }, [ids]);

  useEffect(() => {
    if (!loading && data.length > 0 && !printedRef.current) {
      printedRef.current = true;
      generatePDF();
    }
  }, [loading, data]);

  // tanggal
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // get data
  const getData = async () => {
    try {
      if (navigator.onLine) {
        // ONLINE → Ambil dari API

        const formData = new FormData();
        formData.append('ids', JSON.stringify(ids));

        const res = await postData('/admin/cetakLaporanBarangMasuk', formData);

        setData(res.data);

        // simpan ke IndexedDB
        const cacheKey = `laporanBarangMasuk-${ids.join('-')}`;
        await set(cacheKey, res.data);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cacheKey = `laporanBarangMasuk-${ids.join('-')}`;
        const cached = await get(cacheKey);

        if (cached) {
          setData(cached);
        } else {
          setData({ error: 'Data tidak tersedia offline' });
        }
      }
    } catch (err) {
      console.log('Error load:', err);

      // Jika error API → coba fallback ke IndexedDB
      const cacheKey = `laporanBarangMasuk-${ids.join('-')}`;
      const cached = await get(cacheKey);
      if (cached) {
        setData(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  // ketika button di klik
  const generatePDF = () => {
    const element = document.getElementById('print-content');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'laporan barang masuk.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div id="print-content" key={location.search}>
      <Card sx={{ p: 4 }}>
        {/* jika datanya error(tidak tersedia offline) maka tampilkan pesan error */}
        {data?.error && <Poppins style={{ color: 'red' }}>{data.error}</Poppins>}
        {data && !data.error && (
          <>
            <Stack>
              {/* title perusahaan */}
              <Poppins sx={{ fontWeight: 700, textAlign: 'center' }}>CV. INDO RETAIL ABADI</Poppins>
              {/* title barang masuk */}
              <Poppins sx={{ mt: 2 }}>Barang Masuk</Poppins>
              {/* title tanggal print */}
              <Poppins sx={{ mt: 1 }}>Tanggal : {today}</Poppins>
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
                  {loading ? (
                    <StyledTableRowCetak>
                      <StyledTableCellCetak colSpan={5}>Loading...</StyledTableCellCetak>
                    </StyledTableRowCetak>
                  ) : (
                    Array.isArray(data) &&
                    data.map((row, i) => {
                      return (
                        <StyledTableRowCetak key={row.id}>
                          <StyledTableCellCetak>{i + 1}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.kode_barang}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.nama}</StyledTableCellCetak>
                          <StyledTableCellCetak>Rp.{row.harga}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.jumlah}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.sub_kategori}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.tanggal_masuk}</StyledTableCellCetak>
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
          </>
        )}
      </Card>
    </div>
  );
}
