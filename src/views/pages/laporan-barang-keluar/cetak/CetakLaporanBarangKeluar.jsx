import { Box, Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import {
  dataBarangMasuk,
  dataCetakAbsensi,
  dataLaporanBarangKeluar,
  // dataLaporanBarangKeluar,
  dataPermitaanBarang,
  dataStok
} from '../../../../utils/constan';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';
import { set, get } from 'idb-keyval';
import { fetchData, postData } from '../../../../api/api';
import { useLocation } from 'react-router-dom';

export default function CetakLaporanBarangKeluar() {
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

        const res = await postData('/admin/cetakLaporanBarangKeluar', formData);

        setData(res.data);

        // simpan ke IndexedDB
        const cacheKey = `laporanBarangKeluar-${ids.join('-')}`;
        await set(cacheKey, res.data);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cacheKey = `laporanBarangKeluar-${ids.join('-')}`;
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
      const cacheKey = `laporanBarangKeluar-${ids.join('-')}`;
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
      margin: [5, 5, 5, 5],
      filename: 'barang keluar.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth // 🔥 penting
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape' // 🔥 WAJIB
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'] // 🔥 KUNCI UTAMA
      }
    };

    html2pdf().set(opt).from(element).save();
  };
  return (
    <div id="print-content">
      <Card sx={{ p: 4 }}>
        {/* jika data nya error(tdk tersedia offline) maka tampilkan pesan error */}
        {data?.error && <Poppins style={{ color: 'red' }}>{data.error}</Poppins>}
        {data && !data.error && (
          <>
            <Stack>
              <Poppins sx={{ fontWeight: 700, textAlign: 'center' }}>CV. INDO RETAIL ABADI</Poppins>
              <Poppins sx={{ mt: 2 }}>Barang Keluar</Poppins>
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
                    <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Harga Barang</TableCell>
                    <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Tanggal Keluar</TableCell>
                    <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Sub Kategori</TableCell>
                    <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Toko Tujuan</TableCell>
                    <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Jumlah Barang</TableCell>
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
                          <StyledTableCellCetak>{row.tanggal_keluar}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.sub_kategori}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.toko_tujuan}</StyledTableCellCetak>
                          <StyledTableCellCetak>{row.jumlah}</StyledTableCellCetak>
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
