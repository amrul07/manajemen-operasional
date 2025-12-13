// src/path/to/UserLogic.jsx
import React, { useEffect, useState } from 'react';
import { deleteData, fetchData, postData } from '../../../api/api';
import useGlobalStore from '../../../store/globalStore';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan
import { useNavigate } from 'react-router-dom';

// --------------------
// Offline storage keys
// --------------------
const OFFLINE_LAPORANBARANGMASUK = 'offline-laporan-barang-masuk'; // cache data barang masuk
const OFFLINE_QUEUE = 'offline-queue'; // antrian operasi (create/update/delete) saat offline
const OFFLINE_PRINT_IDS = 'offline-print-ids';

// --------------------
// Helper IndexedDB (idb-keyval)
// --------------------
const getOfflineLaporanBarangMasuk = async () => (await get(OFFLINE_LAPORANBARANGMASUK)) || []; // ambil cached laporan barang masuk
const saveOfflineLaporanBarangMasuk = async (barangMasuk) => await set(OFFLINE_LAPORANBARANGMASUK, barangMasuk || []); // simpan cached laporan barang masuk
const getOfflinePrintIds = async () => (await get(OFFLINE_PRINT_IDS)) || []; //ambil id print laporan barang masuk
const saveOfflinePrintIds = async (ids) => await set(OFFLINE_PRINT_IDS, ids || []); //simpan id print laporan barang masuk
const getQueue = async () => (await get(OFFLINE_QUEUE)) || []; // ambil queue
const saveQueue = async (q) => await set(OFFLINE_QUEUE, q || []); // simpan queue
const removeQueueItemByLocalId = async (localId) => {
  // hapus item queue pakai localId
  const q = await getQueue();
  const newQ = q.filter((it) => it.localId !== localId);
  await saveQueue(newQ);
};

// --------------------
// Main hook / logic
// --------------------
export default function LaporanBarangMasukLogic() {
  const router = useNavigate();

  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di tabel
  const searchQuery = useGlobalStore((state) => state.searchQuery); // global search
  const [itemsPerPage, setItemsPerPage] = useState(10); // items per page
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(0); // total pages dari server / local
  const [totalItems, setTotalItems] = useState(0); // total items

  const [idPrint, setIdPrint] = useState([]);

  // misc UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);

  // offline related state
  const [isOnline, setIsOnline] = useState(navigator.onLine); // online status
  const [offlineLaporanBarangMasuk, setOfflineLaporanBarangMasukState] = useState([]); // cached barang masuk array

  // --------------------
  // Utility: sort newest first
  // --------------------
  const sortNewestFirst = (arr) => {
    if (!Array.isArray(arr)) return [];
    // kalau id numeric, urut descending.
    return arr.slice().sort((a, b) => {
      const ai = Number(a?.id ?? 0);
      const bi = Number(b?.id ?? 0);
      return bi - ai;
    });
  };

  // --------------------
  // EFFECT: Init (load cache + register online/offline listener)
  // --------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // load cached barang masuk dulu (jika ada)
      try {
        const cached = await getOfflineLaporanBarangMasuk(); // baca dari IndexedDB
        const savedPrintIds = await getOfflinePrintIds();
        setIdPrint(savedPrintIds);
        if (!mounted) return;
        setOfflineLaporanBarangMasukState(cached); // simpan di state offline
        // show cached data immediately (so UX shows something)
        if (!navigator.onLine) {
          setData(sortNewestFirst(cached)); // tampilkan cache saat offline
          setPage(1);
          setTotalItems(cached.length);
          setTotalPages(1);
          setLoadingGet(false);
          return;
        }
      } catch (err) {
        console.warn('init cache load error', err);
      }

      // jika online, fetch data pertama kali dari server
      await getData();
    };

    init();

    // event listeners online/offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      mounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hanya sekali saat mount

  // --------------------
  // EFFECT: refetch on pagination / search change
  // --------------------
  useEffect(() => {
    // whenever page/itemsPerPage/search changes, re-get data
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, page, searchQuery]);

  useEffect(() => {
    saveOfflinePrintIds(idPrint);
  }, [idPrint]);

  // --------------------
  // Online/offline handlers
  // --------------------
  const handleOnline = async () => {
    setIsOnline(true); // set flag online
    try {
      await syncOfflineQueue(); // coba sinkronkan antrian
    } catch (err) {
      console.log('syncOfflineQueue error', err);
    }
    await getData(); // refresh data dari server
  };

  const handleOffline = () => {
    setIsOnline(false);
    // show cached data if any
    (async () => {
      const cached = await getOfflineLaporanBarangMasuk();
      setOfflineLaporanBarangMasukState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
    })();
  };

  const syncOfflineQueue = async () => {
    const queue = await getQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      try {
        if (item.type === 'PRINT_LAPORAN_BARANG_MASUK') {
          const formData = new FormData();
          item.payload.ids.forEach((id) => formData.append('ids[]', id));

          await postData('/admin/cetakLaporanBarangMasuk', formData);
        }

        // hapus dari queue jika sukses
        await removeQueueItemByLocalId(item.localId);
        await saveOfflinePrintIds([]);
        setIdPrint([]);
      } catch (err) {
        console.error('Sync gagal, akan dicoba ulang', err);
        break; // stop biar tidak looping error
      }
    }
  };

  // --------------------
  // getData: ambil data (online) atau fallback ke IndexedDB (offline)
  // --------------------
  const getData = async () => {
    // offline fallback: tampilkan cached barang masuk
    if (!isOnline) {
      setLoadingGet(false);
      const cached = await getOfflineLaporanBarangMasuk();
      setOfflineLaporanBarangMasukState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
      return;
    }

    // online: ambil dari API
    try {
      setLoadingPagination(true);
      const res = await fetchData(`/admin/laporanBarangMasuk?perpage=${itemsPerPage}&page=${page}&search=${searchQuery}`);
      const serverData = res?.data || [];
      const sorted = sortNewestFirst(serverData); // urut terbaru dulu
      // setData(sorted); // tampilkan di UI
      setData(res.data); // tampilkan di UI
      setOfflineLaporanBarangMasukState(sorted); // keep cached copy in memory
      await saveOfflineLaporanBarangMasuk(sorted); // simpan ke IndexedDB agar offline bisa pakai

      // update pagination meta dari server
      setPage(res.meta?.page ?? 1);
      setTotalPages(res.meta?.total_page ?? 1);
      setTotalItems(res.meta?.total_item ?? sorted.length);
    } catch (err) {
      console.error('getData error', err);
      // fallback ke cached kalau fetch gagal
      const cached = await getOfflineLaporanBarangMasuk();
      setOfflineLaporanBarangMasukState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
    } finally {
      setLoadingGet(false);
      setLoadingPagination(false);
    }
  };

  //   print data
  const handlePrint = async () => {
    setLoading(true);
    if (idPrint.length === 0) {
      setSnackbar({ open: true, message: 'Pilih data terlebih dahulu' });
      setLoading(false);
      return;
    }

    // ===== JIKA OFFLINE =====
    if (!isOnline) {
      const queue = await getQueue();

      //   queue.push({
      //     localId: Date.now(),
      //     type: 'PRINT_LAPORAN_BARANG_MASUK',
      //     payload: {
      //       ids: idPrint
      //     }
      //   });

      //   await saveQueue(queue);

      //   setSnackbar({
      //     open: true,
      //     message: 'Offline: Data disimpan & akan dikirim saat online'
      //   });

      //   return;
      router('/laporan-barang-masuk/cetak', {
        state: { ids: idPrint }
      });
    }

    // jika online
    try {
      await postData(`/admin/cetakLaporanBarangMasuk`, { ids: JSON.stringify(idPrint) });
    } catch (error) {
      console.log('FULL ERROR:', error.response);
      console.log('ERROR DATA:', error.response?.data);
      console.error('Gagal menambahkan data:', error);
      let pesanError = 'Terjadi kesalahan saat menambah data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
      setLoading(false);
    } finally {
      router('/laporan-barang-masuk/cetak', {
        state: { ids: idPrint }
      });
      setIdPrint([]);
      setLoading(false);
    }
  };

  //   ketika tombol ceklis d klik
  const handleCeklis = (id) => {
    setIdPrint((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // uncheck
      }
      return [...prev, id]; // check
    });
  };

  console.log({ idPrint });
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ open: false, message: '' });
  }; // snackbar close
  const handleChangePage = (event, newPage) => setPage(newPage); // pagination
  const handleChangeItemsPerPage = (value) => {
    setItemsPerPage(value);
    setPage(1);
  }; // change perpage resets to page 1

  // --------------------
  // return API untuk komponen
  // --------------------
  return {
    value: {
      data,
      itemsPerPage,
      page,
      totalPages,
      totalItems,
      snackbar,
      loading,
      loadingGet,
      loadingPagination,
      isOnline, // expose status bila perlu di UI
      idPrint
    },
    func: {
      closeSnackbar,
      handleChangePage,
      handleChangeItemsPerPage,
      handlePrint,
      handleCeklis
    }
  };
}
