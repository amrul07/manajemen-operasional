// assets
import {
  IconKey,
  IconUserCheck,
  IconStack3,
  IconShoppingCartPlus,
  IconStackPush,
  IconStackPop,
  IconPackageImport,
  IconPackageExport,
  IconUser,
  IconClipboardText
} from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconUserCheck,
  IconStack3,
  IconShoppingCartPlus,
  IconStackPush,
  IconStackPop,
  IconPackageImport,
  IconPackageExport,
  IconUser,
  IconClipboardText
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  // caption: 'Pages Caption',
  icon: icons.IconKey,
  type: 'group',
  roles: ['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa'],
  children: [
    {
      id: 1,
      title: 'Data Absensi',
      type: 'item',
      url: '/data-absensi',
      icon: icons.IconUserCheck,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff']
    },
    {
      id: 2,
      title: 'Data Stok',
      type: 'item',
      url: '/data-stok',
      icon: icons.IconStack3,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff']
    },
    {
      id: 3,
      title: 'Permintaan Barang',
      type: 'item',
      url: '/permintaan-barang',
      icon: icons.IconShoppingCartPlus,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff']
    },
    {
      id: 4,
      title: 'Barang Masuk',
      type: 'item',
      url: '/barang-masuk',
      icon: icons.IconStackPush,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa']
    },
    {
      id: 5,
      title: 'Barang Keluar',
      type: 'item',
      url: '/barang-keluar',
      icon: icons.IconStackPop,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa']
    },
    {
      id: 6,
      title: 'Laporan Barang Masuk',
      type: 'item',
      url: '/laporan-barang-masuk',
      icon: icons.IconPackageImport,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff']
    },
    {
      id: 7,
      title: 'Laporan Barang Keluar',
      type: 'item',
      url: '/laporan-barang-keluar',
      icon: icons.IconPackageExport,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Karyawan Pelapor']
    },
    { id: 8, title: 'User', type: 'item', url: '/user', icon: icons.IconUser, breadcrumbs: false, roles: ['Pimpinan', 'Staff'] },
    {
      id: 9,
      title: 'Abensi Saya',
      type: 'item',
      url: '/absensi-saya',
      icon: icons.IconClipboardText,
      breadcrumbs: false,
      roles: ['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa']
    }
  ]
};

export default pages;
