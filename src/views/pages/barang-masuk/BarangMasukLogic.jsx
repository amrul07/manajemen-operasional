// src/path/to/UserLogic.jsx
import React, { useEffect, useState } from 'react';
import { deleteData, fetchData, postData } from '../../../api/api';
import useGlobalStore from '../../../store/globalStore';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan
import { useNavigate } from 'react-router-dom';

// --------------------
// Offline storage keys
// --------------------
const OFFLINE_BARANGMASUK = 'offline-barang-masuk'; // cache data barang masuk
const OFFLINE_QUEUE = 'offline-queue'; // antrian operasi (create/update/delete) saat offline

// --------------------
// Helper IndexedDB (idb-keyval)
// --------------------
const getOfflineBarangMasuk = async () => (await get(OFFLINE_BARANGMASUK)) || []; // ambil cached barang masuk
const saveOfflineBarangMasuk = async (barangMasuk) => await set(OFFLINE_BARANGMASUK, barangMasuk || []); // simpan cached barang masuk
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
export default function BarangMasukLogic() {
  const router = useNavigate();

  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di tabel
  const searchQuery = useGlobalStore((state) => state.searchQuery); // global search
  const [itemsPerPage, setItemsPerPage] = useState(10); // items per page
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(0); // total pages dari server / local
  const [totalItems, setTotalItems] = useState(0); // total items

  // form / modal state
  const [newData, setNewData] = useState({
    kode_barang: '',
    nama: '',
    harga: '',
    jumlah: '',
    sub_kategori: '',
    tanggal_masuk: '',
    jumlah: '',
    sub_kategori: '',
    tanggal_masuk: ''
  }); // form
  const [modal, setModal] = useState({ data: false, delete: false, succes: false }); // modal flags
  const [deleteId, setDeleteId] = useState(null); // id untuk delete
  const [editingId, setEditingId] = useState(null); // id yang sedang diedit
  const [editMode, setEditMode] = useState(false); // mode edit true/false

  // misc UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);

  // offline related state
  const [isOnline, setIsOnline] = useState(navigator.onLine); // online status
  const [offlineBarangMasuk, setOfflineBarangMasukState] = useState([]); // cached barang masuk array

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
        const cached = await getOfflineBarangMasuk(); // baca dari IndexedDB
        if (!mounted) return;
        setOfflineBarangMasukState(cached); // simpan di state offline
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
      const cached = await getOfflineBarangMasuk();
      setOfflineBarangMasukState(cached);
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
    // offline fallback: tampilkan cached barang masuk
    if (!isOnline) {
      setLoadingGet(false);
      const cached = await getOfflineBarangMasuk();
      setOfflineBarangMasukState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
      return;
    }

    // online: ambil dari API
    try {
      setLoadingPagination(true);
      const res = await fetchData(`/admin/barangMasuk?perpage=${itemsPerPage}&page=${page}&search=${searchQuery}`);
      const serverData = res?.data || [];
      const sorted = sortNewestFirst(serverData); // urut terbaru dulu
      // setData(sorted); // tampilkan di UI
      setData(res.data); // tampilkan di UI
      setOfflineBarangMasukState(sorted); // keep cached copy in memory
      await saveOfflineBarangMasuk(sorted); // simpan ke IndexedDB agar offline bisa pakai

      // update pagination meta dari server
      setPage(res.meta?.page ?? 1);
      setTotalPages(res.meta?.total_page ?? 1);
      setTotalItems(res.meta?.total_item ?? sorted.length);
    } catch (err) {
      console.error('getData error', err);
      // fallback ke cached kalau fetch gagal
      const cached = await getOfflineBarangMasuk();
      setOfflineBarangMasukState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
    } finally {
      setLoadingGet(false);
      setLoadingPagination(false);
    }
  };

  // --------------------
  // syncOfflineQueue: proses antrian saat kembali online
  // Struktur item queue: { localId, action: 'create'|'update'|'delete', data?, id?, timestamp }
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
          await postData('/admin/barangMasuk', payload); // kirim ke server (JSON)
        } else if (qItem.action === 'update') {
          const payload = { ...qItem.data }; // payload harus mengandung id (server id jika ada)
          const formData = new FormData();
          Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
          formData.append('_method', 'PUT');
          await postData(`/admin/barangMasuk/${payload.id}`, formData);
        } else if (qItem.action === 'delete') {
          await deleteData(`/admin/barangMasuk/${qItem.id}`);
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
          const current = await getOfflineBarangMasuk();

          // update offlineBarangMasuk array
          const updated = current.map((item) => {
            if (item.id === editingId) {
              return {
                ...item,
                kode_barang: newData.kode_barang,
                nama: newData.nama,
                harga: newData.harga,
                jumlah: newData.jumlah,
                sub_kategori: newData.sub_kategori,
                tanggal_masuk: newData.tanggal_masuk
              };
            }
            return item;
          });

          await saveOfflineBarangMasuk(updated); // simpan ke IndexedDB
          setOfflineBarangMasukState(updated); // update state offline
          setData(sortNewestFirst(updated)); // tampilkan update di UI

          // push update ke queue (localId agar bisa dihapus nanti)
          const localId = Date.now();
          const queue = await getQueue();
          queue.push({
            localId,
            action: 'update',
            data: {
              id: editingId,
              kode_barang: newData.kode_barang,
              nama: newData.nama,
              harga: newData.harga,
              jumlah: newData.jumlah,
              sub_kategori: newData.sub_kategori,
              tanggal_masuk: newData.tanggal_masuk
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
          setNewData({
            kode_barang: '',
            nama: '',
            harga: '',
            jumlah: '',
            sub_kategori: '',
            tanggal_masuk: '',
            jumlah: '',
            sub_kategori: '',
            tanggal_masuk: ''
          });
          setLoading(false);
        }
        return;
      }

      // ------------ ONLINE: kirim update ke server ------------
      try {
        const formData = new FormData();
        formData.append('kode_barang', newData.kode_barang);
        formData.append('nama', newData.nama);
        formData.append('harga', newData.harga);
        formData.append('jumlah', newData.jumlah);
        formData.append('sub_kategori', newData.sub_kategori);
        formData.append('tanggal_masuk', newData.tanggal_masuk);
        formData.append('_method', 'PUT');
        await postData(`/admin/barangMasuk/${editingId}`, formData); // post dengan method override
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
        setNewData({
          kode_barang: '',
          nama: '',
          harga: '',
          jumlah: '',
          sub_kategori: '',
          tanggal_masuk: '',
          jumlah: '',
          sub_kategori: '',
          tanggal_masuk: ''
        });
        setModal((prev) => ({ ...prev, data: false }));
        setLoading(false);
      }

      return;
    }

    // ---------- CREATE MODE ----------
    if (!isOnline) {
      // offline create: buat object local dengan id besar (timestamp) + isOffline flag
      try {
        // baca current cached barang masuk (hindari stale closure)
        const current = await getOfflineBarangMasuk();

        const localId = Date.now(); // local unique id
        const newBarangMasuk = {
          id: localId,
          kode_barang: newData.kode_barang,
          nama: newData.nama,
          harga: newData.harga,
          jumlah: newData.jumlah,
          sub_kategori: newData.sub_kategori,
          tanggal_masuk: newData.tanggal_masuk,
          isOffline: true
        };

        // simpan di cache offline: prepend supaya muncul paling atas (terbaru dulu)
        const updated = [newBarangMasuk, ...current];
        await saveOfflineBarangMasuk(updated); // simpan ke IndexedDB
        setOfflineBarangMasukState(updated); // update local state
        setData(sortNewestFirst(updated)); // tampilkan terbaru dulu

        // push create ke queue untuk disync nanti
        const queue = await getQueue();
        queue.push({ localId, action: 'create', data: newBarangMasuk, timestamp: Date.now() });
        await saveQueue(queue);

        // feedback & close modal
        setModal((prev) => ({ ...prev, succes: true, data: false }));
      } catch (err) {
        console.error('Gagal menambahkan data offline', err);
        setSnackbar({ open: true, message: 'Gagal menambahkan data (offline).' });
      } finally {
        setNewData({ kode_barang: '', nama: '', harga: '', jumlah: '', sub_kategori: '', tanggal_masuk: '' });
        setLoading(false);
      }
      return;
    }

    // ------------ ONLINE create normal ------------
    try {
      const formDataPost = new FormData();
      formDataPost.append('kode_barang', newData.kode_barang);
      formDataPost.append('nama', newData.nama);
      formDataPost.append('harga', newData.harga);
      formDataPost.append('jumlah', newData.jumlah);
      formDataPost.append('sub_kategori', newData.sub_kategori);
      formDataPost.append('tanggal_masuk', newData.tanggal_masuk);
      await postData(`/admin/barangMasuk`, formDataPost); // kirim ke server
      await getData(); // refresh
      setModal((prev) => ({ ...prev, succes: true }));
    } catch (error) {
      console.error('Gagal menambahkan data:', error);
      let pesanError = 'Terjadi kesalahan saat menambah data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setNewData({ kode_barang: '', nama: '', harga: '', jumlah: '', sub_kategori: '', tanggal_masuk: '' });
      setModal((prev) => ({ ...prev, data: false }));
      setLoading(false);
    }
  };

  // --------------------
  // handleDelete: offline-aware delete
  // --------------------
  const handleDelete = async () => {
    setLoading(true);

    if (!isOnline) {
      try {
        // hapus dari cached array (filter)
        const current = await getOfflineBarangMasuk();
        const filtered = current.filter((item) => item.id !== deleteId);
        await saveOfflineBarangMasuk(filtered);
        setOfflineBarangMasukState(filtered);
        setData(sortNewestFirst(filtered));

        // push delete ke queue
        const localId = Date.now();
        const queue = await getQueue();
        queue.push({ localId, action: 'delete', id: deleteId, timestamp: Date.now() });
        await saveQueue(queue);
      } catch (err) {
        console.error('Gagal menghapus data offline', err);
        setSnackbar({ open: true, message: 'Gagal menghapus data (offline).' });
      } finally {
        setDeleteId(null);
        setModal((prev) => ({ ...prev, delete: false }));
        setLoading(false);
      }
      return;
    }

    // online delete normal
    try {
      await deleteData(`/admin/barangMasuk/${deleteId}`);
      await getData();
    } catch (error) {
      console.error('Gagal menghapus data:', error);
      let pesanError = 'Terjadi kesalahan saat menghapus data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setDeleteId(null);
      setModal((prev) => ({ ...prev, delete: false }));
      setLoading(false);
    }
  };

  // --------------------
  // modal / form helpers (UI)
  // --------------------
  const handleModal = () => setModal((prev) => ({ ...prev, data: true })); // buka modal add/edit
  const openModalDelete = (id) => {
    setModal((prev) => ({ ...prev, delete: true }));
    setDeleteId(id);
  }; // buka modal delete
  const handleCloseModal = () => {
    // tutup modal dan reset form
    setModal({ data: false, delete: false, succes: false });
    setEditMode(false);
    setEditingId(null);
    setNewData({
      kode_barang: '',
      nama: '',
      harga: '',
      jumlah: '',
      sub_kategori: '',
      tanggal_masuk: '',
      jumlah: '',
      sub_kategori: '',
      tanggal_masuk: ''
    });
  };

  //   print data
  const handlePrint = (id) => {
    router(`/barang-masuk/cetak/${id}`);
  };

  //   edit data
  const handleEdit = (id) => {
    // prepare data untuk edit modal
    setEditingId(id);
    const selectedItem = data.find((item) => item.id === id) || offlineBarangMasuk.find((item) => item.id === id);
    if (!selectedItem) return;
    setNewData({
      kode_barang: selectedItem?.kode_barang || '',
      nama: selectedItem?.nama || '',
      harga: selectedItem?.harga || '',
      jumlah: selectedItem?.jumlah || '',
      sub_kategori: selectedItem?.sub_kategori || '',
      tanggal_masuk: selectedItem?.tanggal_masuk || ''
    });
    setModal((prev) => ({ ...prev, data: true }));
    setEditMode(true);
  };

  const handleChange = (e) => setNewData({ ...newData, [e.target.name]: e.target.value }); // input change
  const handleChangeharga = (event, newValue) => setNewData((prev) => ({ ...prev, harga: newValue ?? '' })); // autocomplete change
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
      deleteId,
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
      handleChangeharga,
      handleModal,
      handleCloseModal,
      openModalDelete,
      handleEdit,
      closeSnackbar,
      handleChangePage,
      handleChangeItemsPerPage,
      handleSave,
      handleDelete,
      handlePrint
    }
  };
}
