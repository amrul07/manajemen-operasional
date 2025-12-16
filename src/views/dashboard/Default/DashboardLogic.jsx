import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval'; // idb-keyval untuk IndexedDB ringan
import { fetchData } from '../../../api/api';

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
  // UI / pagination state
  const [data, setData] = useState([]); // data yang ditampilkan di dashboard
  const [dataChart, setDataChart] = useState([]);

  // misc UI
  const [loadingGet, setLoadingGet] = useState(true);

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
  useEffect(() => {
    // whenever page/itemsPerPage/search changes, re-get data
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // --------------------
  // return API untuk komponen
  // --------------------
  return {
    value: {
      data,
      dataChart,
      loadingGet,
      isOnline // expose status bila perlu di UI
    },
    func: {}
  };
}
