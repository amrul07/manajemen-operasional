import React, { useEffect, useState } from 'react';
import { fetchData, postData } from '../../../api/api';
import useGlobalStore from '../../../store/globalStore';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan
import { useNavigate } from 'react-router-dom';

// --------------------
// Offline storage keys
// --------------------
const OFFLINE_ABSENSI_SAYA = 'offline-absensi-saya'; // cache data absensi saya
const OFFLINE_QUEUE = 'offline-queue'; // antrian operasi (create/update) saat offline
const LAST_LOCATION_KEY = 'last-location'; // lokasi terakhir

// --------------------
// Helper IndexedDB (idb-keyval)
// --------------------
const getOfflineAbsensiSaya = async () => (await get(OFFLINE_ABSENSI_SAYA)) || []; // ambil cached absensi saya
const saveOfflineAbsensiSaya = async (absensiSaya) => await set(OFFLINE_ABSENSI_SAYA, absensiSaya || []); // simpan cached absensi saya
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
export default function AbsensiSayaLogic() {
  const router = useNavigate();
  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di tabel
  const searchQuery = useGlobalStore((state) => state.searchQuery); // global search
  const [itemsPerPage, setItemsPerPage] = useState(10); // items per page
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(0); // total pages dari server / local
  const [totalItems, setTotalItems] = useState(0); // total items

  // form / modal state
  const [newData, setNewData] = useState({ latitude: '', longitude: '', tanggal: '', waktu: '' }); // form
  const [izin, setIzin] = useState({ image_proof: '', keterangan: '', kategori: '' });
  const [modal, setModal] = useState({ data: false, succes: false, izin: false }); // modal flags

  // misc UI
  const [previewImage, setPreviewImage] = useState(null); // lihat gambar di modal
  const [selectedFile, setSelectedFile] = useState(null); // file yg terpilih
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [loadingClockOut, setLoadingClockOut] = useState(false);
  const [loadingIzin, setLoadingIzin] = useState(false);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);

  // offline related state
  const [isOnline, setIsOnline] = useState(navigator.onLine); // online status
  const [offlineAbsensiSaya, setOfflineAbsensiSayaState] = useState([]); // cached barang keluar array

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
        const cached = await getOfflineAbsensiSaya(); // baca dari IndexedDB
        if (!mounted) return;
        setOfflineAbsensiSayaState(cached); // simpan di state offline
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
    // await getData(); // refresh data dari server
  };

  const handleOffline = () => {
    setIsOnline(false);
    // show cached data if any
    (async () => {
      const cached = await getOfflineAbsensiSaya();
      setOfflineAbsensiSayaState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
    })();
  };

  // get lokasi online & offline : lattitude, longitude
  const getLocationOfflineSafe = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000, // ⬅️ lebih cepat
          maximumAge: 1000 * 60 * 60 * 24 * 365 // 1 tahun
        });
      });

      const loc = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(loc));
      return loc;
    } catch (err) {
      // console.log('Location error:', err);
      // fallback ke lokasi terakhir
      const cached = localStorage.getItem(LAST_LOCATION_KEY);
      if (cached) return JSON.parse(cached);

      return {
        latitude: null,
        longitude: null
      };
    }
  };

  // get waktu
  const getTime = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  // get tanggal bulan tahun
  const getDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const base64ToFile = (base64, filename) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  // --------------------
  // getData: ambil data (online) atau fallback ke IndexedDB (offline)
  // --------------------
  const getData = async () => {
    // offline fallback: tampilkan cached barang keluar
    if (!isOnline) {
      setLoadingGet(false);
      const cached = await getOfflineAbsensiSaya();
      setOfflineAbsensiSayaState(cached);
      setData(sortNewestFirst(cached));
      setPage(1);
      setTotalItems(cached.length);
      setTotalPages(1);
      return;
    }

    // online: ambil dari API
    try {
      setLoadingPagination(true);
      const res = await fetchData(`/absensi/history?perpage=${itemsPerPage}&page=${page}&search=${searchQuery}`);
      const serverData = res?.data || [];
      const sorted = sortNewestFirst(serverData); // urut terbaru dulu
      setData(sorted); // tampilkan di UI
      setOfflineAbsensiSayaState(sorted); // keep cached copy in memory
      await saveOfflineAbsensiSaya(sorted); // simpan ke IndexedDB agar offline bisa pakai

      // update pagination meta dari server
      setPage(res.meta?.page ?? 1);
      setTotalPages(res.meta?.total_page ?? 1);
      setTotalItems(res.meta?.total_item ?? sorted.length);
    } catch (err) {
      console.error('getData error', err);
      // fallback ke cached kalau fetch gagal
      const cached = await getOfflineAbsensiSaya();
      setOfflineAbsensiSayaState(cached);
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
  // Struktur item queue: { localId, action: 'create'|'update' data?, id?, timestamp }
  // --------------------
  const syncOfflineQueue = async () => {
    // 🔒 WAJIB PALING ATAS
    if (!navigator.onLine) {
      console.log('Masih offline, batal sync');
      return;
    }

    let hasCriticalError = false; // ⬅️ TARUH DI SINI

    const queue = await getQueue();
    if (!queue.length) return;

    // 🔍 DEBUG (sementara)
    // console.log('QUEUE:', queue);
    // console.log('CACHE:', await getOfflineAbsensiSaya());

    for (const qItem of queue) {
      try {
        // ===============================
        // CEK DOUBLE CLOCK-IN (PALING ATAS)
        // ===============================
        if (qItem.type === 'clock-in') {
          const cached = await getOfflineAbsensiSaya();

          const alreadyClockIn = cached.some((it) => it.tanggal === qItem.data.tanggal && !it.isOffline);

          if (alreadyClockIn) {
            console.warn('Sudah clock-in, hapus queue', qItem);
            await removeQueueItemByLocalId(qItem.localId);
            continue; // ⬅️ lanjut ke item queue berikutnya
          }
        }
        if (qItem.type === 'clock-out') {
          const cached = await getOfflineAbsensiSaya();

          const hasClockIn = cached.some((it) => {
            // clock-in offline
            if (it.type === 'clock-in' && it.tanggal === qItem.data.tanggal) {
              return true;
            }

            // clock-in server (pakai field waktu_checkin)
            if (it.waktu_checkin && it.waktu_checkin !== '-') {
              return true;
            }

            return false;
          });

          if (!hasClockIn) {
            console.warn('Clock-out tanpa clock-in, hapus queue', qItem);
            await removeQueueItemByLocalId(qItem.localId);
            continue;
          }
        }

        const formData = new FormData();

        if (qItem.type === 'clock-in') {
          formData.append('latitude', qItem.data.latitude);
          formData.append('longitude', qItem.data.longitude);
          formData.append('tanggal', qItem.data.tanggal);
          formData.append('waktu', qItem.data.waktu);
        } else if (qItem.type === 'clock-out') {
          formData.append('latitude', qItem.data.latitude);
          formData.append('longitude', qItem.data.longitude);
          formData.append('tanggal', qItem.data.tanggal);
          formData.append('waktu', qItem.data.waktu);
        } else if (qItem.type === 'izin') {
          Object.entries(qItem.data).forEach(([k, v]) => {
            if (['id', 'isOffline', 'imageBase64', 'filename'].includes(k)) return;
            formData.append(k, v);
          });

          if (qItem.data.imageBase64) {
            const file = base64ToFile(qItem.data.imageBase64, qItem.data.filename);
            formData.append('image_proof', file);
          }
        } else {
          Object.entries(qItem.data).forEach(([k, v]) => {
            formData.append(k, v);
          });
        }

        await postData(qItem.endpoint, formData);

        // hapus queue item
        await removeQueueItemByLocalId(qItem.localId);
      } catch (err) {
        console.error('SYNC ERROR:', {
          endpoint: qItem.endpoint,
          payload: qItem.data,
          response: err?.response?.data
        });

        console.error('SYNC ERROR:', err?.response?.data || err);

        // ❌ clock-in → aman dihapus & lanjut
        if (qItem.type === 'clock-in') {
          await removeQueueItemByLocalId(qItem.localId);
          continue;
        }

        // 🚨 clock-out / izin → error KRITIS
        hasCriticalError = true;

        // clock-out & izin → STOP (data penting)
        break;
      }
    }

    if (hasCriticalError) {
      console.warn('Sync dihentikan karena error penting');
      return;
    }

    // 🔥 INI WAJIB
    const res = await fetchData('/absensi/history?perpage=100&page=1');
    const serverData = res.data || [];

    const cleaned = serverData.map(({ type, ...rest }) => rest);

    await saveOfflineAbsensiSaya(cleaned);
    setOfflineAbsensiSayaState(cleaned);
    setData(sortNewestFirst(cleaned));
  };

  // --------------------
  // handleClockIn: absen masuk
  // --------------------
  const handleClockIn = async () => {
    setLoading(true);

    try {
      const location = await getLocationOfflineSafe();

      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
        // tanggal: '2025-12-21',
        tanggal: getDate(),
        waktu: getTime()
      };

      // ---------------- OFFLINE ----------------
      if (!isOnline) {
        const current = await getOfflineAbsensiSaya();
        const localId = Date.now();

        const offlineData = {
          id: localId,
          type: 'clock-in',
          ...payload,
          isOffline: true
        };

        const updated = [offlineData, ...current];
        await saveOfflineAbsensiSaya(updated);
        setData(sortNewestFirst(updated));

        const queue = await getQueue();
        queue.push({
          localId,
          type: 'clock-in',
          action: 'create',
          endpoint: '/absensi/clock-in',
          data: payload
        });
        await saveQueue(queue);

        setModal((p) => ({ ...p, succes: true, data: false }));
        return;
      }

      // ---------------- ONLINE ----------------
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v));

      await postData('/absensi/clock-in', formData);
      await getData();
      setModal((p) => ({ ...p, succes: true }));
    } catch (error) {
      console.error('Gagal menambahkan data:', error);
      let pesanError = 'Terjadi kesalahan saat menambah data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // handleClockOut: absen pulang
  // --------------------
  const handleClockOut = async () => {
    setLoadingClockOut(true);

    try {
      const location = await getLocationOfflineSafe();

      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
        // tanggal: '2025-12-25',
        tanggal: getDate(),
        // waktu: '17:05'
        waktu: getTime()
      };

      // ---------------- OFFLINE ----------------
      if (!isOnline) {
        const current = await getOfflineAbsensiSaya();
        const localId = Date.now();

        const offlineData = {
          id: localId,
          type: 'clock-out',
          ...payload,
          isOffline: true
        };

        const updated = [offlineData, ...current];
        await saveOfflineAbsensiSaya(updated);
        setData(sortNewestFirst(updated));

        const queue = await getQueue();
        queue.push({
          localId,
          type: 'clock-out',
          action: 'create',
          endpoint: '/absensi/clock-out',
          data: payload
        });
        await saveQueue(queue);

        setModal((p) => ({ ...p, succes: true, data: false }));
        return;
      }

      // ---------------- ONLINE ----------------
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v));

      await postData('/absensi/clock-out', formData);
      await getData();
      setModal((p) => ({ ...p, succes: true }));
    } catch (error) {
      console.error('Gagal menambahkan data:', error);
      let pesanError = 'Terjadi kesalahan saat menambah data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setLoadingClockOut(false);
    }
  };

  // --------------------
  // handleIzin: izin/sakit
  // --------------------
  const handleIzin = async () => {
    setLoadingIzin(true);

    try {
      const location = await getLocationOfflineSafe();

      const payload = {
        // latitude: location.latitude,
        // longitude: location.longitude,
        keterangan: izin.keterangan,
        kategori: izin.kategori
        // tanggal: getDate(),
        // waktu: getTime()
      };

      // ================= OFFLINE =================
      if (!isOnline) {
        if (!izin.image_proof || !selectedFile) {
          throw new Error('Bukti izin wajib diisi');
        }

        const localId = Date.now();
        const current = await getOfflineAbsensiSaya();

        const offlineData = {
          id: localId,
          type: 'izin',
          ...payload,
          imageBase64: izin.image_proof, // SIMPAN BASE64
          filename: selectedFile.name,
          kategori: izin.kategori,
          isOffline: true
        };

        const updated = [offlineData, ...current];
        await saveOfflineAbsensiSaya(updated);
        setData(sortNewestFirst(updated));

        const queue = await getQueue();
        queue.push({
          localId,
          type: 'izin',
          action: 'create',
          endpoint: '/absensi/izin-sakit',
          data: offlineData
        });
        await saveQueue(queue);

        setModal((p) => ({ ...p, succes: true, data: false }));
        return;
      }

      // ================= ONLINE =================
      const formData = new FormData();
      formData.append('keterangan', payload.keterangan);
      formData.append('image_proof', selectedFile);
      formData.append('kategori', payload.kategori);

      await postData('/absensi/izin-sakit', formData);
      await getData();

      setModal((p) => ({ ...p, succes: true }));
    } catch (error) {
      console.error('Gagal menambahkan data:', error);
      let pesanError = 'Terjadi kesalahan saat menambah data';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      setSnackbar({ open: true, message: pesanError });
    } finally {
      setLoadingIzin(false);
      setIzin({ image_proof: '', keterangan: '', kategori: '' });
      setSelectedFile(null);
      setPreviewImage(null);
      setModal((prev) => ({ ...prev, data: false }));
    }
  };

  // --------------------
  // modal / form helpers (UI)
  // --------------------

  // modal absensi saya
  const handleModal = () => {
    router(`/absensi-saya`);
  };
  const handleModalIzin = () => {
    setModal((prev) => ({ ...prev, izin: true }));
  };
  const handleCloseModal = () => {
    // tutup modal dan reset form
    setModal({ data: false, succes: false, izin: false });
    setNewData({ latitude: '', longitude: '', tanggal: '', waktu: '' });
  };

  // handle change clockIn & clockOut
  const handleChange = (e) => setNewData({ ...newData, [e.target.name]: e.target.value }); // input change
  // handleChange keterangan Izin/sakit
  const handleChangeKeterangan = (e) => {
    setIzin((prev) => ({ ...prev, keterangan: e.target.value }));
  };
  // handleChange kategori Izin/sakit
  const handleChangeKategori = (event, newValue) => setIzin((prev) => ({ ...prev, kategori: newValue })); // autocomplete kategori izin/sakit
  // const handleChangewaktu = (event, newValue) => setNewData((prev) => ({ ...prev, waktu: newValue ?? '' })); // autocomplete change
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ open: false, message: '' });
  }; // snackbar close
  const handleChangePage = (event, newPage) => setPage(newPage); // pagination
  const handleChangeItemsPerPage = (value) => {
    setItemsPerPage(value);
    setPage(1);
  }; // change perpage resets to page 1

  // tombol input image
  const handleChooseFileClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  // penanganan gambar
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setIzin((prev) => ({ ...prev, image_proof: reader.result }));
      };
      reader.readAsDataURL(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage));
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (event) => {
    const selectedImage = event.dataTransfer.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setIzin((prev) => ({ ...prev, image_proof: reader.result }));
      };
      reader.readAsDataURL(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage));
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // fungsi untuk menghapus gambar yang di pilih ketika menambah/mengedit data
  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

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
      snackbar,
      loading,
      loadingClockOut,
      loadingIzin,
      loadingGet,
      loadingPagination,
      isOnline, // expose status bila perlu di UI
      izin,
      previewImage,
      selectedFile
    },
    func: {
      handleChange,
      handleModal,
      handleCloseModal,
      closeSnackbar,
      handleChangePage,
      handleChangeItemsPerPage,
      handleClockIn,
      handleClockOut,
      handleModalIzin,
      handleChangeKeterangan,
      handleChangeKategori,
      handleChooseFileClick,
      handleImageChange,
      handleDrop,
      handleDragOver,
      removeImage,
      handleIzin
    }
  };
}
