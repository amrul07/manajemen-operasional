// src/path/to/UserLogic.jsx
import React, { useEffect, useState } from 'react';
import { fetchData, postData } from '../../../api/api';
import useGlobalStore from '../../../store/globalStore';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan

// --------------------
// Offline storage keys
// --------------------
const OFFLINE_BARANG_KELUAR = 'offline-barang-keluar'; // cache data barang keluar
const OFFLINE_QUEUE = 'offline-queue'; // antrian operasi (create/update) saat offline

// --------------------
// Helper IndexedDB (idb-keyval)
// --------------------
const getOfflineBarangKeluar = async () => (await get(OFFLINE_BARANG_KELUAR)) || []; // ambil cached barang keluar
const saveOfflineBarangKeluar = async (barangKeluar) => await set(OFFLINE_BARANG_KELUAR, barangKeluar || []); // simpan cached barang keluar
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
export default function BarangKeluarLogic() {
  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di tabel
  const [dataStock, setDataStock] = useState([]); // data dropdown
  const searchQuery = useGlobalStore((state) => state.searchQuery); // global search
  const [itemsPerPage, setItemsPerPage] = useState(10); // items per page
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(0); // total pages dari server / local
  const [totalItems, setTotalItems] = useState(0); // total items

  // form / modal state
  const [newData, setNewData] = useState({ barang_id: '', tanggal_keluar: '', toko_tujuan: '', jumlah: '' }); // form
  const [modal, setModal] = useState({ data: false, succes: false }); // modal flags
  const [editingId, setEditingId] = useState(null); // id yang sedang diedit
  const [editMode, setEditMode] = useState(false); // mode edit true/false

  // misc UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);

  // offline related state
  const [isOnline, setIsOnline] = useState(navigator.onLine); // online status
  const [offlineBarangKeluar, setOfflineBarangKeluarState] = useState([]); // cached barang keluar array

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
      // load cached barang keluar dulu (jika ada)
      try {
        const cached = await getOfflineBarangKeluar(); // baca dari IndexedDB
        if (!mounted) return;
        setOfflineBarangKeluarState(cached); // simpan di state offline
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
    getDataStok();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, page, searchQuery]);

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
      const cached = await getOfflineBarangKeluar();
      setOfflineBarangKeluarState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
    })();
  };

  // --------------------
  // getData: ambil data (online) atau fallback ke IndexedDB (offline)
  // --------------------
  const getData = async () => {
    // offline fallback: tampilkan cached barang keluar
    if (!isOnline) {
      setLoadingGet(false);
      const cached = await getOfflineBarangKeluar();
      setOfflineBarangKeluarState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
      return;
    }

    // online: ambil dari API
    try {
      setLoadingPagination(true);
      const res = await fetchData(`/admin/barangKeluar?perpage=${itemsPerPage}&page=${page}&search=${searchQuery}`);
      const serverData = res?.data || [];
      const sorted = sortNewestFirst(serverData); // urut terbaru dulu
      setData(sorted); // tampilkan di UI
      setOfflineBarangKeluarState(sorted); // keep cached copy in memory
      await saveOfflineBarangKeluar(sorted); // simpan ke IndexedDB agar offline bisa pakai

      // update pagination meta dari server
      setPage(res.meta?.page ?? 1);
      setTotalPages(res.meta?.total_page ?? 1);
      setTotalItems(res.meta?.total_item ?? sorted.length);
    } catch (err) {
      console.error('getData error', err);
      // fallback ke cached kalau fetch gagal
      const cached = await getOfflineBarangKeluar();
      setOfflineBarangKeluarState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
    } finally {
      setLoadingGet(false);
      setLoadingPagination(false);
    }
  };

  // data dropdown
  const getDataStok = async () => {
    const res = await fetchData(`/admin/allStok`);
    setDataStock(res.data);
    console.log(res);
  };

  console.log(dataStock);

  // --------------------
  // syncOfflineQueue: proses antrian saat kembali online
  // Struktur item queue: { localId, action: 'create'|'update' data?, id?, timestamp }
  // --------------------
  const syncOfflineQueue = async () => {
    const queue = await getQueue();
    if (!queue || queue.length === 0) return;

    // proses sequential supaya mudah debugging & konsisten
    for (const qItem of queue) {
      try {
        if (qItem.action === 'create') {
          // backend biasanya mengembalikan object lengkap (dengan id server)
          const payload = { ...qItem.data };
          // hapus flags lokal agar backend tidak kebingungan
          delete payload.id;
          delete payload.isOffline;

          // NOTE: many backends expect multipart/form-data for file uploads.
          // If your backend requires FormData for creation, change this to send FormData.
          await postData('/admin/barangKeluar', payload); // kirim ke server (JSON)
        } else if (qItem.action === 'update') {
          const payload = { ...qItem.data }; // payload harus mengandung id (server id jika ada)
          const formData = new FormData();
          Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
          formData.append('_method', 'PUT');
          await postData(`/admin/barangKeluar/${payload.id}`, formData);
        }

        // success -> hapus dari queue
        await removeQueueItemByLocalId(qItem.localId);
      } catch (err) {
        console.warn('sync item failed, keep in queue for later', qItem, err);
        // jangan hapus item, akan dicoba lagi nanti
      }
    }
  };

  // --------------------
  // handleSave: create / edit dengan dukungan offline
  // --------------------
  const handleSave = async () => {
    setLoading(true);

    // ---------- EDIT MODE ----------
    if (editMode) {
      // offline edit -> update cached array & push queue
      if (!isOnline) {
        try {
          // baca data offline terbaru dari IndexedDB (hindari stale state)
          const current = await getOfflineBarangKeluar();

          // update offlineBarangKeluar array (jadikan field sesuai format response: barang_id, no_hp, jumlah)
          const updated = current.map((item) => {
            if (item.id === editingId) {
              return {
                ...item,
                barang_id: newData.barang_id,
                tanggal_keluar: newData.tanggal_keluar,
                toko_tujuan: newData.toko_tujuan,
                jumlah: newData.jumlah
              };
            }
            return item;
          });

          await saveOfflineBarangKeluar(updated); // simpan ke IndexedDB
          setOfflineBarangKeluarState(updated); // update state offline
          setData(sortNewestFirst(updated)); // tampilkan update di UI

          // push update ke queue (localId agar bisa dihapus nanti)
          const localId = Date.now();
          const queue = await getQueue();
          queue.push({
            localId,
            action: 'update',
            data: {
              id: editingId,
              barang_id: newData.barang_id,
              tanggal_keluar: newData.tanggal_keluar,
              toko_tujuan: newData.toko_tujuan,
              jumlah: newData.jumlah
            },
            timestamp: Date.now()
          });
          await saveQueue(queue);

          // beri feedback & close modal
          setModal((prev) => ({ ...prev, succes: true, data: false }));
        } catch (err) {
          console.error('Gagal menyimpan edit offline', err);
          setSnackbar({ open: true, message: 'Gagal menyimpan perubahan (offline).' });
        } finally {
          // reset form state
          setEditMode(false);
          setEditingId(null);
          setNewData({ barang_id: '', barang_id: '', jumlah: '' });
          setLoading(false);
        }
        return;
      }

      // ------------ ONLINE: kirim update ke server ------------
      try {
        const formData = new FormData();
        formData.append('barang_id', newData.barang_id);
        formData.append('tanggal_keluar', newData.tanggal_keluar);
        formData.append('toko_tujuan', newData.toko_tujuan);
        formData.append('jumlah', newData.jumlah);
        formData.append('_method', 'PUT');
        await postData(`/admin/barangKeluar/${editingId}`, formData); // post dengan method override
        await getData(); // refresh dari server
        setModal((prev) => ({ ...prev, succes: true }));
      } catch (error) {
        console.error('Gagal mengedit data:', error);
        let pesanError = 'Terjadi kesalahan saat mengedit data';
        if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
        setSnackbar({ open: true, message: pesanError });
      } finally {
        setEditMode(false);
        setEditingId(null);
        setNewData({ barang_id: '', tanggal_keluar: '', toko_tujuan: '', jumlah: '' });
        setModal((prev) => ({ ...prev, data: false }));
        setLoading(false);
      }

      return;
    }

    // ---------- CREATE MODE ----------
    if (!isOnline) {
      // offline create: buat object local dengan id besar (timestamp) + isOffline flag
      try {
        // baca current cached barang keluar (hindari stale closure)
        const current = await getOfflineBarangKeluar();

        const localId = Date.now(); // local unique id
        const newUser = {
          id: localId,
          barang_id: newData.barang_id,
          tanggal_keluar: newData.tanggal_keluar,
          toko_tujuan: newData.toko_tujuan,
          jumlah: newData.jumlah,
          isOffline: true
        };

        // simpan di cache offline: prepend supaya muncul paling atas (terbaru dulu)
        const updated = [newUser, ...current];
        await saveOfflineBarangKeluar(updated); // simpan ke IndexedDB
        setOfflineBarangKeluarState(updated); // update local state
        setData(sortNewestFirst(updated)); // tampilkan terbaru dulu

        // push create ke queue untuk disync nanti
        const queue = await getQueue();
        queue.push({ localId, action: 'create', data: newUser, timestamp: Date.now() });
        await saveQueue(queue);

        // feedback & close modal
        setModal((prev) => ({ ...prev, succes: true, data: false }));
      } catch (err) {
        console.error('Gagal menambahkan data offline', err);
        setSnackbar({ open: true, message: 'Gagal menambahkan data (offline).' });
      } finally {
        setNewData({ barang_id: '', tanggal_keluar: '', toko_tujuan: '', jumlah: '' });
        setLoading(false);
      }
      return;
    }

    // ------------ ONLINE create normal ------------
    try {
      const formDataPost = new FormData();
      formDataPost.append('barang_id', newData.barang_id);
      formDataPost.append('tanggal_keluar', newData.tanggal_keluar);
      formDataPost.append('toko_tujuan', newData.toko_tujuan);
      formDataPost.append('jumlah', newData.jumlah);
      await postData(`/admin/barangKeluar`, formDataPost); // kirim ke server
      await getData(); // refresh
      setModal((prev) => ({ ...prev, succes: true }));
    } catch (error) {
      console.error('Gagal menambahkan data:', error);
      let pesanError = 'Terjadi kesalahan saat menambah data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setNewData({ barang_id: '', tanggal_keluar: '', toko_tujuan: '', jumlah: '' });
      setModal((prev) => ({ ...prev, data: false }));
      setLoading(false);
    }
  };

  // --------------------
  // modal / form helpers (UI)
  // --------------------
  const handleModal = () => setModal((prev) => ({ ...prev, data: true })); // buka modal add/edit
  const handleCloseModal = () => {
    // tutup modal dan reset form
    setModal({ data: false, succes: false });
    setEditMode(false);
    setEditingId(null);
    setNewData({ barang_id: '', tanggal_keluar: '', toko_tujuan: '', jumlah: '' });
  };

  const handleEdit = (id) => {
    // prepare data untuk edit modal
    setEditingId(id);
    const selectedItem = data.find((item) => item.id === id) || offlineBarangKeluar.find((item) => item.id === id);
    if (!selectedItem) return;
    setNewData({
      barang_id: selectedItem?.barang_id || '',
      tanggal_keluar: selectedItem?.tanggal_keluar || '',
      toko_tujuan: selectedItem?.toko_tujuan || '',
      jumlah: selectedItem?.jumlah || ''
    });
    setModal((prev) => ({ ...prev, data: true }));
    setEditMode(true);
  };

  const handleChange = (e) => setNewData({ ...newData, [e.target.name]: e.target.value }); // input change
  const handleChangejumlah = (event, newValue) => setNewData((prev) => ({ ...prev, jumlah: newValue ?? '' })); // autocomplete change
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
      newData,
      setNewData,
      modal,
      editMode,
      editingId,
      snackbar,
      loading,
      loadingGet,
      loadingPagination,
      isOnline // expose status bila perlu di UI
    },
    func: {
      handleChange,
      handleChangejumlah,
      handleModal,
      handleCloseModal,
      handleEdit,
      closeSnackbar,
      handleChangePage,
      handleChangeItemsPerPage,
      handleSave
    }
  };
}
