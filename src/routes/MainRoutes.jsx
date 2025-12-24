import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import { authLoader } from './Loader';
import ProtectedRoute from './ProtectedRoute';
// import DataAbsensi from '../views/pages/data-absensi/DataAbsensi'
// import BarangKeluar from '../views/pages/barang-keluar/BarangKeluar';
// import User from '../views/pages/user/User';
// import AbsensiSaya from '../views/pages/absensi-saya/AbsensiSaya';
// import DetailAbsensi from '../views/pages/data-absensi/DetailAbsensi';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// pages routing
const DataAbsensi = Loadable(lazy(() => import('../views/pages/data-absensi/DataAbsensi')));
const DetailAbsensi = Loadable(lazy(() => import('../views/pages/data-absensi/detail/DetailAbsensi')));
const CetakDataAbsensi = Loadable(lazy(() => import('../views/pages/data-absensi/cetak/CetakLaporanAbsensi')));
const DataStok = Loadable(lazy(() => import('../views/pages/data-stok/DataStok')));
const DetailStok = Loadable(lazy(() => import('../views/pages/data-stok/detail/DetailStok')));
const CetakDataStok = Loadable(lazy(() => import('../views/pages/data-stok/cetak/CetakDataStok')));
const PermintaanBarang = Loadable(lazy(() => import('../views/pages/permintaan-barang/PermintaanBarang')));
const CetakPermintaanBarang = Loadable(lazy(() => import('../views/pages/permintaan-barang/cetak/CetakPermintaanBarang')));
const BarangMasuk = Loadable(lazy(() => import('../views/pages/barang-masuk/BarangMasuk')));
const CetakBarangMasuk = Loadable(lazy(() => import('../views/pages/barang-masuk/cetak/CetakBarangMasuk')));
const BarangKeluar = Loadable(lazy(() => import('../views/pages/barang-keluar/BarangKeluar')));
const LaporanBarangMasuk = Loadable(lazy(() => import('../views/pages/laporan-barang-masuk/LaporanBarangMasuk')));
const CetakLaporanBarangMasuk = Loadable(lazy(() => import('../views/pages/laporan-barang-masuk/cetak/CetakLaporanBarangMasuk')));
const LaporanBarangKeluar = Loadable(lazy(() => import('../views/pages/laporan-barang-keluar/LaporanBarangKeluar')));
const CetakLaporanBarangKeluar = Loadable(lazy(() => import('../views/pages/laporan-barang-keluar/cetak/CetakLaporanBarangKeluar')));
const AbsensiSaya = Loadable(lazy(() => import('../views/pages/absensi-saya/AbsensiSaya')));
const RiwayatAbsensi = Loadable(lazy(() => import('../views/pages/absensi-saya/RiwayatAbsensi')));
const User = Loadable(lazy(() => import('../views/pages/user/User')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  loader: authLoader,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'data-absensi',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <DataAbsensi />
        </ProtectedRoute>
      )
    },
    {
      path: 'data-absensi/detail/:id',
      element: (
        <ProtectedRoute roles={['Pimpinan']}>
          <DetailAbsensi />
        </ProtectedRoute>
      )
    },
    {
      path: 'data-absensi/cetak/:tahun/:bulan',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <CetakDataAbsensi />
        </ProtectedRoute>
      )
    },
    {
      path: 'data-stok',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <DataStok />
        </ProtectedRoute>
      )
    },
    {
      path: 'data-stok/detail/:id',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <DetailStok />
        </ProtectedRoute>
      )
    },
    {
      path: 'data-stok/cetak',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <CetakDataStok />
        </ProtectedRoute>
      )
    },
    {
      path: 'permintaan-barang',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <PermintaanBarang />
        </ProtectedRoute>
      )
    },
    {
      path: 'permintaan-barang/cetak/',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <CetakPermintaanBarang />
        </ProtectedRoute>
      )
    },
    {
      path: 'barang-masuk',
      element: <BarangMasuk />
    },
    {
      path: 'barang-masuk/cetak/:id',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <CetakBarangMasuk />
        </ProtectedRoute>
      )
    },
    {
      path: 'barang-keluar',
      element: <BarangKeluar />
    },
    {
      path: 'laporan-barang-masuk',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <LaporanBarangMasuk />
        </ProtectedRoute>
      )
    },
    {
      path: 'laporan-barang-masuk/cetak',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <CetakLaporanBarangMasuk />
        </ProtectedRoute>
      )
    },
    {
      path: 'laporan-barang-keluar',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Karyawan Pelapor']}>
          <LaporanBarangKeluar />
        </ProtectedRoute>
      )
    },
    {
      path: 'laporan-barang-keluar/cetak',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Karyawan Pelapor']}>
          <CetakLaporanBarangKeluar />
        </ProtectedRoute>
      )
    },
    {
      path: 'user',
      element: (
        <ProtectedRoute roles={['Pimpinan', 'Staff']}>
          <User />
        </ProtectedRoute>
      )
    },
    {
      path: 'absensi-saya',
      element: <AbsensiSaya />
    },
    {
      path: 'absensi-saya/riwayat-absensi',
      element: <RiwayatAbsensi />
    }
  ]
};

export default MainRoutes;
