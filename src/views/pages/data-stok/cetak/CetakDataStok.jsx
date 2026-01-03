import { Box, Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import { fetchData } from '../../../../api/api';
import { set, get } from 'idb-keyval';

export default function CetakDataStok() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // tanggal
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // =============================
  // LOAD DATA (ONLINE / OFFLINE)
  // =============================
  const loadData = async () => {
    try {
      if (navigator.onLine) {
        // ONLINE → API
        const res = await fetchData(`/admin/cetakStok`);
        setData(res.data);

        // SIMPAN CACHE
        await set('cetak-stok', res.data);

        // DELAY KECIL AGAR RENDER SEBELUM CETAK
        setTimeout(() => generatePDF(), 800);
      } else {
        // OFFLINE → IndexedDB
        const cached = await get('cetak-stok');

        if (cached) {
          setData(cached);
          setTimeout(() => generatePDF(), 800);
        } else {
          setData({ error: 'Data tidak tersedia offline. Harap buka halaman ini saat online minimal sekali.' });
        }
      }
    } catch (error) {
      console.log('Error load:', error);

      // Jika API error, fallback ke cache
      const cached = await get('cetak-stok');
      if (cached) {
        setData(cached);
        setTimeout(() => generatePDF(), 800);
      } else {
        setData({ error: 'Gagal mengambil data & tidak ada cache offline.' });
      }
    }
  };

  // =============================
  // FUNGSI CETAK PDF
  // =============================
  const generatePDF = () => {
    const element = document.getElementById('print-content');
    if (!element) return;

    const opt = {
      margin: [5, 5, 5, 5],
      filename: 'data-stok.pdf',
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
        {/* jika data error(tidak tersedia offline) maka tampilkan pesan error */}
        {data?.error && <Poppins sx={{ color: 'red', textAlign: 'center' }}>{data.error}</Poppins>}

        {data && !data.error && (
          <>
            <Stack>
              {/* title perusahaan */}
              <Poppins sx={{ fontWeight: 700, textAlign: 'center' }}>CV. INDO RETAIL ABADI</Poppins>
              {/* title data stok */}
              <Poppins sx={{ mt: 2 }}>Data Stok</Poppins>
              {/* title tanggal */}
              <Poppins sx={{ mt: 1 }}>Tanggal : {today}</Poppins>
            </Stack>

            {/* tabel data */}
            <TableContainer sx={{ mt: 2 }} component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#1e88e5', color: '#fff' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>No</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Nama Barang</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Kode Barang</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Harga Barang</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Stok</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Stok Awal</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Sub Kategori</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Tanggal Masuk</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Tanggal Update</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data &&
                    data.map((row, i) => (
                      <StyledTableRowCetak key={row.id}>
                        <StyledTableCellCetak>{i + 1}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.nama}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.kode_barang}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.harga}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.stok_total}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.stok_awal}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.sub_kategori}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.tanggal_masuk}</StyledTableCellCetak>
                        <StyledTableCellCetak>{row.tanggal_update}</StyledTableCellCetak>
                      </StyledTableRowCetak>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Card>
    </div>
  );
}
