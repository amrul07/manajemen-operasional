import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan
import { fetchData, postData } from '../../../api/api';
import { enableNotification } from '../../../utils/fcm';
import { useLocation } from 'react-router-dom';

// --------------------
// Offline storage keys
// --------------------
const OFFLINE_DASHBOARD = 'offline-dashboard'; // cache data dashboard
const OFFLINE_QUEUE = 'offline-queue'; // antrian operasi (create/update/delete) saat offline
const OFFLINE_DASHBOARD_CHART = 'offline-dashboard-chart';

// --------------------
// Helper IndexedDB (idb-keyval)
// --------------------
const getOfflineDashboard = async () => (await get(OFFLINE_DASHBOARD)) || []; // ambil cached dashboard
const saveOfflineDashboard = async (barangKeluar) => await set(OFFLINE_DASHBOARD, barangKeluar || []); // simpan cached dashboard
const getOfflineDashboardChart = async () => (await get(OFFLINE_DASHBOARD_CHART)) || []; // ambil cached data chart
const saveOfflineDashboardChart = async (chart) => await set(OFFLINE_DASHBOARD_CHART, chart || []); // simpan cached data chart

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
export default function DashboardLogic() {
  const location = useLocation();
  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di dashboard
  const [dataChart, setDataChart] = useState([]);
  const [open, setOpen] = useState(false); // alert untuk mengizinkan notifikasi absen

  // misc UI
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingDialog, setLoadingDialog] = useState(false);

  // offline related state
  const [isOnline, setIsOnline] = useState(navigator.onLine); // online status
  const [offlineDashboard, setOfflineDashboardState] = useState([]); // cached barang masuk array

  // --------------------
  // EFFECT: Init (load cache + register online/offline listener)
  // --------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // load cached barang masuk dulu (jika ada)
      try {
        const cached = await getOfflineDashboard(); // baca dari IndexedDB
        const cachedChart = await getOfflineDashboardChart();

        if (!mounted) return;
        setOfflineDashboardState(cached); // simpan di state offline
        // show cached data immediately (so UX shows something)
        if (!navigator.onLine) {
          setData(cached); // tampilkan cache data saat offline
          setDataChart(cachedChart); // tampilkan cache chart saat offline
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

  // useEffect(() => {
  //   if (location.state?.showNotificationConsent) {
  //     setOpen(true);
  //   }
  // }, [location.state]);

  useEffect(() => {
    const tokenSent = localStorage.getItem('fcm-token-sent');

    if (!tokenSent) {
      setOpen(true); // ⬅️ dialog muncul
      localStorage.setItem('fcm-consent-shown', 'true');
    }
  }, []);

  // --------------------
  // Online/offline handlers
  // --------------------
  const handleOnline = async () => {
    setIsOnline(true); // set flag online
    // try {
    //   await syncOfflineQueue(); // coba sinkronkan antrian
    // } catch (err) {
    //   console.log('syncOfflineQueue error', err);
    // }
    await getData(); // refresh data dari server
  };

  const handleOffline = () => {
    setIsOnline(false);
    // show cached data if any
    (async () => {
      const cached = await getOfflineDashboard();
      const cachedChart = await getOfflineDashboardChart();
      setOfflineDashboardState(cached);
      setData(cached);
      setDataChart(cachedChart);
    })();
  };

  // --------------------
  // getData: ambil data (online) atau fallback ke IndexedDB (offline)
  // --------------------
  const getData = async () => {
    // offline fallback: tampilkan cached barang masuk
    if (!isOnline) {
      setLoadingGet(false);
      const cached = await getOfflineDashboard();
      const cachedChart = await getOfflineDashboardChart();
      setOfflineDashboardState(cached);
      setData(cached);
      setDataChart(cachedChart);
      return;
    }

    // online: ambil dari API
    try {
      const res = await fetchData(`/dashboard`);
      const resChart = await fetchData(`/dashboard/chart`);
      const serverData = res?.data || [];
      const serverChart = Array.isArray(resChart) ? resChart : [];
      setData(res.data); // tampilkan di UI
      setDataChart(serverChart);

      setOfflineDashboardState(serverData); // keep cached copy in memory
      await saveOfflineDashboard(serverData); // simpan ke IndexedDB agar data offline bisa pakai
      await saveOfflineDashboardChart(serverChart); // simpan ke IndexedDB agar data chart offline bisa pakai
    } catch (err) {
      console.error('getData error', err);
      // fallback ke cached kalau fetch gagal
      const cached = await getOfflineDashboard();
      const cachedChart = await getOfflineDashboardChart();
      setOfflineDashboardState(cached);
      setData(cached);
      setDataChart(cachedChart);
    } finally {
      setLoadingGet(false);
    }
  };

  // saat button verifikasi notifikasi di klik
  const handleEnableNotification = async () => {
    setLoadingDialog(true);
    const fcmToken = await enableNotification();

    if (!fcmToken) {
      alert('Izin notifikasi ditolak');
      setOpen(false);
      return;
    }

    try {
      //initialize formData
      const formData = new FormData();

      //append data to formData
      formData.append('token', fcmToken);

      const res = await postData(`/fcm-token`, formData);

      // ✅ TANDAI TOKEN SUDAH TERKIRIM
      localStorage.setItem('fcm-token-sent', 'true');
      // console.log(res);
    } catch (error) {
      console.error('Gagal :', error);
      let pesanError = 'Terjadi kesalahan ';
      if (error.response) pesanError = error?.response?.data?.message || error?.message || pesanError;
      // setSnackbar((prev) => ({ ...prev, open: true, message: pesanError }));
    } finally {
      alert('Notifikasi absensi berhasil diaktifkan ✅');
      setOpen(false);
      setLoadingDialog(false);
    }
  };

  // --------------------
  // return API untuk komponen
  // --------------------
  return {
    value: {
      data,
      dataChart,
      loadingGet,
      isOnline, // expose status bila perlu di UI
      open,
      setOpen,
      loadingDialog
    },
    func: {
      handleEnableNotification
    }
  };
}
