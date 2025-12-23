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
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../../ui-component/button/CustomButton';
import { Poppins } from '../../../../ui-component/typography/Poppins';
import html2pdf from 'html2pdf.js';
import { StyledTableCellCetak, StyledTableRowCetak } from '../../../../ui-component/table/StyledTableCetak';
import ButtonStyle from '../../../../ui-component/button/ButtonStyle';
import { IconPrinter } from '@tabler/icons-react';
import { fetchData, postData } from '../../../../api/api';
import { useParams } from 'react-router-dom';
import { set, get } from 'idb-keyval';

export default function CetakBarangMasuk() {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);

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
        const res = await fetchData(`/admin/barangMasuk/${id}`);
        const detail = res.data;

        setData(detail);

        // simpan ke IndexedDB
        await set(`cetakbarangMasuk-${id}`, detail);
      } else {
        // OFFLINE → Ambil dari IndexedDB
        const cached = await get(`cetakbarangMasuk-${id}`);

        if (cached) {
          setData(cached);
        } else {
          setData({ error: 'Data tidak tersedia offline' });
        }
      }
    } catch (err) {
      console.log('Error load:', err);

      // Jika error API → coba fallback ke IndexedDB
      const cached = await get(`cetakbarangMasuk-${id}`);
      if (cached) {
        setData(cached);
      }
    }
  };

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
      {!data && <Poppins>Loading...</Poppins>}

      {data?.error && <Poppins style={{ color: 'red' }}>{data.error}</Poppins>}
      <div id="print-content">
        <Stack>
          <Poppins sx={{ fontWeight: 700, textAlign: 'center' }}>CV. INDO RETAIL ABADI</Poppins>
          <Poppins sx={{ mt: 2 }}>Lapor Barang</Poppins>
          <Poppins sx={{ mt: 1 }}>Tanggal : {today}</Poppins>
        </Stack>
        {/* tabel data */}
        <TableContainer sx={{ fontFamily: "`'Poppins', sans-serif`", mt: 2 }} component={Paper}>
          <Table>
            <TableHead sx={{ fontFamily: "`'Poppins', sans-serif`", backgroundColor: '#1e88e5', color: '#fff' }}>
              {/*  */}
              <TableRow sx={{}}>
                {/* <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>No</TableCell> */}
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Kode Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Nama Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Harga </TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Jumlah Barang</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Sub Kategori</TableCell>
                <TableCell sx={{ fontFamily: "`'Poppins', sans-serif`", color: '#fff' }}>Tanggal Masuk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "`'Poppins', sans-serif`" }}>
              {data && !data.error && (
                <StyledTableRowCetak key={data.id}>
                  {/* <StyledTableCellCetak>{data.id}</StyledTableCellCetak> */}
                  <StyledTableCellCetak>{data.kode_barang}</StyledTableCellCetak>
                  <StyledTableCellCetak>{data.nama}</StyledTableCellCetak>
                  <StyledTableCellCetak>Rp.{data.harga}</StyledTableCellCetak>
                  <StyledTableCellCetak>{data.jumlah}</StyledTableCellCetak>
                  <StyledTableCellCetak>{data.sub_kategori}</StyledTableCellCetak>
                  <StyledTableCellCetak>{data.tanggal_masuk}</StyledTableCellCetak>
                </StyledTableRowCetak>
              )}
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
