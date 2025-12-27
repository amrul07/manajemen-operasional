import React, { useEffect, useState } from 'react';
import { fetchData, postData } from '../../../api/api';
import useGlobalStore from '../../../store/globalStore';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan
import { useNavigate } from 'react-router-dom';

// --------------------
// Offline storage keys
// --------------------
const OFFLINE_DATA_ABSENSI = 'offline-data-absensi'; // cache data absensi
const OFFLINE_DROPDOWN_ABSENSI = 'offline-tanggal-absensi'; // cache data dropdown
const OFFLINE_BUKTI = 'offline-bukti'; // cache data bukti izin/sakit
const OFFLINE_QUEUE = 'offline-queue'; // antrian operasi (update) saat offline

// --------------------
// Helper IndexedDB (idb-keyval)
// --------------------
const getOfflineDataAbsensi = async () => (await get(OFFLINE_DATA_ABSENSI)) || []; // ambil cached data absensi
const saveOfflineDataAbsensi = async (dataAbsensi) => await set(OFFLINE_DATA_ABSENSI, dataAbsensi || []); // simpan cached data absensi
const getOfflineDropdownAbsensi = async () => (await get(OFFLINE_DROPDOWN_ABSENSI)) || []; // ambil cached data dropdown
const saveOfflineDropdownAbsensi = async (stok) => await set(OFFLINE_DROPDOWN_ABSENSI, stok || []); // simpan cached data dropdown
const getOfflineBukti = async () => (await get(OFFLINE_BUKTI)) || []; // ambil cached data bukti izin/sakit
const saveOfflineBukti = async (stok) => await set(OFFLINE_BUKTI, stok || []); // simpan cached data bukti izin/sakit
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
export default function DataAbsensiLogic() {
  const router = useNavigate();
  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di tabel
  const [dataTanggal, setDataTanggal] = useState([]); // data tanggal dropdown
  const [dataBukti, setDataBukti] = useState([]); // data bukti izin/sakit
  const [dataDropdown, setDataDropdown] = useState(null); // data dropdown
  const searchQuery = useGlobalStore((state) => state.searchQuery); // global search
  const [itemsPerPage, setItemsPerPage] = useState(15); // items per page
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(0); // total pages dari server / local
  const [totalItems, setTotalItems] = useState(0); // total items

  // form / modal state
  const [newStatus, setNewStatus] = useState(''); // status hadir
  const [modal, setModal] = useState({ data: false, succes: false, cetak: false }); // modal flags
  const [editingId, setEditingId] = useState(null); // id yang sedang diedit
  // misc UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [paramsCetak, setParamsCetak] = useState({ bulan: '', tahun: '' });
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);

  // offline related state
  const [isOnline, setIsOnline] = useState(navigator.onLine); // online status
  const [offlineDataAbsensi, setOfflineDataAbsensiState] = useState([]); // cached data absensi array

  // tanggal
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

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
      // load stok dulu (biar dropdown langsung ada)
      const cachedStok = await getOfflineDropdownAbsensi();
      setDataTanggal(cachedStok);
      // load cached data absensi dulu (jika ada)
      try {
        const cached = await getOfflineDataAbsensi(); // baca dari IndexedDB
        if (!mounted) return;
        setOfflineDataAbsensiState(cached); // simpan di state offline
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
      // await getData();
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
  useEffect(() => {
    getDataTanggal();
  }, []);
  // useEffect(() => {
  //   if (!editingId) return;
  //   getDataBukti();
  //   if (dataBukti) {
  //     setStatusApprove(dataBukti.kategori);
  //   }
  // }, [editingId, dataBukti]);
  // --------------------
  useEffect(() => {
    if (!dataDropdown) return;
    getData();
  }, [dataDropdown, page, itemsPerPage, searchQuery]);

  useEffect(() => {
    if (!dataTanggal?.length) return;

    const dropdown = dataTanggal.find((item) => item.label === today) || dataTanggal[0];

    setDataDropdown(dropdown);
  }, [dataTanggal, today]);

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
      const cached = await getOfflineDataAbsensi();
      setOfflineDataAbsensiState(cached);
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
    // offline fallback: tampilkan cached data absensi
    if (!isOnline) {
      setLoadingGet(false);
      const cached = await getOfflineDataAbsensi();
      setOfflineDataAbsensiState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
      return;
    }

    if (!isOnline) return;

    if (!dataDropdown?.label) {
      console.log('getData dibatalkan: dataDropdown belum siap');
      return;
    }
    // online: ambil dari API
    try {
      setLoadingPagination(true);
      const dateParam = encodeURIComponent(dataDropdown.label);
      const res = await fetchData(`/data-absensi/on-day?perpage=${itemsPerPage}&page=${page}&search=${searchQuery}&date=${dateParam}`);
      const serverData = res?.data || [];
      const sorted = sortNewestFirst(serverData); // urut terbaru dulu
      setData(sorted); // tampilkan di UI
      setOfflineDataAbsensiState(sorted); // keep cached copy in memory
      await saveOfflineDataAbsensi(sorted); // simpan ke IndexedDB agar offline bisa pakai

      // update pagination meta dari server
      setPage(res.meta?.page ?? 1);
      setItemsPerPage(res.meta?.perpage ?? 15);
      setTotalPages(res.meta?.total_page ?? 1);
      setTotalItems(res.meta?.total_item ?? sorted.length);
    } catch (err) {
      console.error('getData error', err);
      // fallback ke cached kalau fetch gagal
      const cached = await getOfflineDataAbsensi();
      setOfflineDataAbsensiState(cached);
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
  const getDataTanggal = async () => {
    // ---------- OFFLINE ----------
    if (!isOnline) {
      const cachedStok = await getOfflineDropdownAbsensi();
      setDataTanggal(cachedStok);
      return;
    }

    // ---------- ONLINE ----------
    try {
      const res = await fetchData(`/dates-in-month`);
      const tanggal = res?.data || [];

      setDataTanggal(tanggal); // tampilkan di UI
      await saveOfflineDropdownAbsensi(tanggal); // simpan ke IndexedDB
    } catch (err) {
      console.error('getDataTanggal error', err);

      // fallback ke cache kalau fetch gagal
      const cachedTanggal = await getOfflineDropdownAbsensi();
      setDataTanggal(cachedTanggal);
    }
  };
  // data izin/sakit
  const getDataBukti = async () => {
    // ---------- OFFLINE ----------
    if (!isOnline) {
      const cachedBukti = await getOfflineBukti();
      setDataBukti(cachedBukti);
      return;
    }

    // ---------- ONLINE ----------
    try {
      const res = await fetchData(`/data-absensi/bukti-izin-sakit/${editingId}`);
      const dataBukti = res?.data || [];

      setDataBukti(dataBukti); // tampilkan di UI
      await saveOfflineBukti(dataBukti); // simpan ke IndexedDB
    } catch (err) {
      console.error('get Data bukti', err);

      // fallback ke cache kalau fetch gagal
      const cachedbukti = await getOfflineBukti();
      setDataBukti(cachedbukti);
    }
  };

  // --------------------
  // syncOfflineQueue: proses antrian saat kembali online
  // Struktur item queue: { localId, action: 'create'|'update' data?, id?, timestamp }
  // --------------------
  const syncOfflineQueue = async () => {
    const queue = await getQueue();
    if (!queue || queue.length === 0) return;

    for (const qItem of queue) {
      try {
        if (qItem.action !== 'update') continue;

        const payload = { ...qItem.data };
        const formData = new FormData();

        Object.entries(payload).forEach(([k, v]) => {
          formData.append(k, v);
        });

        formData.append('_method', 'PATCH');

        // 🔀 tentukan endpoint berdasarkan type
        let endpoint = '';

        if (qItem.type === 'approve-izin-sakit') {
          endpoint = `/data-absensi/approve-izin-sakit/${payload.id}`;
        } else if (qItem.type === 'update-status') {
          endpoint = `/data-absensi/update-status/${payload.id}`;
        } else {
          throw new Error('Unknown update type');
        }

        await postData(endpoint, formData);

        // ✅ sukses → hapus dari queue
        await removeQueueItemByLocalId(qItem.localId);
      } catch (err) {
        console.warn('sync update failed, keep in queue for later', qItem, err);
        // ❌ jangan dihapus → retry saat online lagi
      }
    }
  };
  // --------------------
  // handleSave: create / edit dengan dukungan offline
  // --------------------
  const handleSave = async () => {
    setLoading(true);
    // ---------- MODE Ubah status kehadiran  ----------
    // offline edit -> update cached array & push queue
    if (!isOnline) {
      try {
        // baca data offline terbaru dari IndexedDB (hindari stale state)
        const current = await getOfflineDataAbsensi();

        // update offlineDataAbsensi array (jadikan field sesuai format response)
        const updated = current.map((item) => {
          if (item.id === editingId) {
            return {
              ...item,
              status: newStatus
            };
          }
          return item;
        });

        await saveOfflineDataAbsensi(updated); // simpan ke IndexedDB
        setOfflineDataAbsensiState(updated); // update state offline
        setData(sortNewestFirst(updated)); // tampilkan update di UI

        // push update ke queue (localId agar bisa dihapus nanti)
        const localId = Date.now();
        const queue = await getQueue();
        queue.push({
          localId,
          action: 'update',
          type: 'update-status',
          data: {
            id: editingId,
            status: newStatus
          },
          timestamp: Date.now()
        });
        await saveQueue(queue);

        // beri feedback & close modal
        setModal((prev) => ({ ...prev, succes: true, data: false, cetak: false }));
      } catch (err) {
        console.error('Gagal menyimpan edit offline', err);
        setSnackbar({ open: true, message: 'Gagal menyimpan perubahan (offline).' });
      } finally {
        setEditingId(null);
        setNewStatus('');
        setLoading(false);
      }
      return;
    }

    // ------------ ONLINE create normal ------------
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('_method', 'PATCH');
      await postData(`/data-absensi/update-status/${editingId}`, formData); // post dengan method override
      await getData(); // refresh dari server
      setModal((prev) => ({ ...prev, succes: true }));
    } catch (error) {
      console.error('Gagal mengedit data:', error);
      let pesanError = 'Terjadi kesalahan saat mengedit data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      // setApproveMode(false);
      setEditingId(null);
      setNewStatus('');
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
    setModal({ data: false, succes: false, cetak: false });
    // setApproveMode(false);
    setEditingId(null);
  };

  //   handle approve izin/sakit
  const handleApprove = (id) => {
    router(`/data-absensi/detail/${id}`);
  };

  //   handle edit status
  const handleEditStatus = (id) => {
    // prepare data untuk edit modal
    setEditingId(id);
    const selectedItem = data.find((item) => item.id === id) || offlineDataAbsensi.find((item) => item.id === id);
    // const selectedDataTanggal = dataTanggal.find((item) => item.id === selectedItem.id);

    if (!selectedItem) return;

    setNewStatus(selectedItem.status || '');
    setModal((prev) => ({ ...prev, data: true }));
  };

  const handleModalCetak = () => {
    setModal((prev) => ({ ...prev, cetak: true }));
  };

  //   cetak
  const handleCetak = () => {
    router(`/data-absensi/cetak/${paramsCetak.tahun}/${paramsCetak.bulan}`);
  };

  const handleChange = (event, newValue) => setNewStatus(newValue); // autocomplete change
  const handleChangeTahun = (e) => setParamsCetak((prev) => ({ ...prev, tahun: e.target.value })); // input change

  const handleChangeBulan = (event, newValue) => setParamsCetak((prev) => ({ ...prev, bulan: newValue })); // autocomplete tahun bulan cetak change

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ open: false, message: '' });
  }; // snackbar close
  const handleChangePage = (event, newPage) => setPage(newPage); // pagination

  //   data dropdown change
  const handleChangeDataDropdown = (value) => {
    setDataDropdown(value);
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
      newStatus,
      setNewStatus,
      modal,
      editingId,
      snackbar,
      loading,
      loadingGet,
      loadingPagination,
      isOnline, // expose status bila perlu di UI
      dataTanggal,
      dataDropdown,
      paramsCetak
    },
    func: {
      handleChange,
      // handleChangejumlah,
      handleModal,
      handleCloseModal,
      handleApprove,
      handleEditStatus,
      closeSnackbar,
      handleChangePage,
      handleChangeDataDropdown,
      handleSave,
      handleModalCetak,
      handleChangeTahun,
      handleChangeBulan,
      handleCetak
    }
  };
}
