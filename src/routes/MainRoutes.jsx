import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
// import User from '../views/pages/user/User';
// import AbsensiSaya from '../views/pages/absensi-saya/AbsensiSaya';
// import DetailAbsensi from '../views/pages/data-absensi/DetailAbsensi';

// dashboard routing  
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// pages routing
const DataAbsensi = Loadable(lazy(() => import('views/pages/data-absensi/DataAbsensi')));
const DetailAbsensi = Loadable(lazy(() => import('views/pages/data-absensi/detail/DetailAbsensi')));
const CetakDataAbsensi = Loadable(lazy(() => import('views/pages/data-absensi/cetak/CetakLaporanAbsensi')));
const DataStok = Loadable(lazy(() => import('views/pages/data-stok/DataStok')));
const DetailStok = Loadable(lazy(() => import('views/pages/data-stok/detail/DetailStok')));
const CetakDataStok = Loadable(lazy(() => import('views/pages/data-stok/cetak/CetakDataStok')));
const PermintaanBarang = Loadable(lazy(() => import('views/pages/permintaan-barang/PermintaanBarang')));
const CetakPermintaanBarang = Loadable(lazy(() => import('views/pages/permintaan-barang/cetak/CetakPermintaanBarang')));
const BarangMasuk = Loadable(lazy(() => import('views/pages/barang-masuk/BarangMasuk')));
const CetakBarangMasuk = Loadable(lazy(() => import('views/pages/barang-masuk/cetak/CetakBarangMasuk')));
const BarangKeluar = Loadable(lazy(() => import('views/pages/barang-keluar/BarangKeluar')));
const LaporanBarangMasuk = Loadable(lazy(() => import('views/pages/laporan-barang-masuk/LaporanBarangMasuk')));
const CetakLaporanBarangMasuk = Loadable(lazy(() => import('views/pages/laporan-barang-masuk/cetak/CetakLaporanBarangMasuk')));
const LaporanBarangKeluar = Loadable(lazy(() => import('views/pages/laporan-barang-keluar/LaporanBarangKeluar')));
const CetakLaporanBarangKeluar = Loadable(lazy(() => import('views/pages/laporan-barang-keluar/cetak/CetakLaporanBarangKeluar')));
const AbsensiSaya = Loadable(lazy(() => import('views/pages/absensi-saya/AbsensiSaya')));
const User = Loadable(lazy(() => import('views/pages/user/User')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsTes = Loadable(lazy(() => import('views/utilities/Tes')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
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
      element: <DataAbsensi />
    },
    {
      path: 'data-absensi/detail/:id',
      element: <DetailAbsensi />
    },
    {
      path: 'data-absensi/cetak/:id',
      element: <CetakDataAbsensi />
    },
    {
      path: 'data-stok',
      element: <DataStok />
    },
    {
      path: 'data-stok/detail/:id',
      element: <DetailStok />
    },
    {
      path: 'data-stok/cetak/:id',
      element: <CetakDataStok />
    },
    {
      path: 'permintaan-barang',
      element: <PermintaanBarang />
    },
    {
      path: 'permintaan-barang/cetak/:id',
      element: <CetakPermintaanBarang />
    },
    {
      path: 'barang-masuk',
      element: <BarangMasuk />
    },
    {
      path: 'barang-masuk/cetak/:id',
      element: <CetakBarangMasuk />
    },
    {
      path: 'barang-keluar',
      element: <BarangKeluar />
    },
    {
      path: 'laporan-barang-masuk',
      element: <LaporanBarangMasuk />
    },
    {
      path: 'laporan-barang-masuk/cetak/:id',
      element: <CetakLaporanBarangMasuk />
    },
    {
      path: 'laporan-barang-keluar',
      element: <LaporanBarangKeluar />
    },
    {
      path: 'laporan-barang-keluar/cetak/:id',
      element: <CetakLaporanBarangKeluar />
    },
    {
      path: 'user',
      element: <User />
    },
    {
      path: 'absensi-saya',
      element: <AbsensiSaya />
    }

    // {
    //   path: 'Tes',
    //   element: <UtilsTes/>
    // },
    // {
    //   path: 'typography',
    //   element: <UtilsTypography />
    // },
    // {
    //   path: 'color',
    //   element: <UtilsColor />
    // },
    // {
    //   path: 'shadow',
    //   element: <UtilsShadow />
    // },
    // {
    //   path: '/sample-page',
    //   element: <SamplePage />
    // }
  ]
};

export default MainRoutes;
