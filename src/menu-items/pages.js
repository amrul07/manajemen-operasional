// assets
import { IconKey,IconUserCheck,IconStack3, IconShoppingCartPlus, IconStackPush, IconStackPop, IconPackageImport, IconPackageExport, IconUser, IconClipboardText } from '@tabler/icons-react';

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
  children: [
    // {
    //   id: 'authentication',
    //   title: 'Authentication',
    //   type: 'collapse',
    //   icon: icons.IconKey,
    //   children: [
    //     {
    //       id: 'login',
    //       title: 'login',
    //       type: 'item',
    //       url: '/pages/login',
    //       target: true
    //     },
    //     {
    //       id: 'register',
    //       title: 'register',
    //       type: 'item',
    //       url: '/pages/register',
    //       target: true
    //     }
    //   ]
    // },
    { id: 1, title: 'Data Absensi', type: 'item', url: '/data-absensi', icon: icons.IconUserCheck, breadcrumbs: false, },
    { id: 2, title: 'Data Stok', type: 'item', url: '/data-stok', icon: icons.IconStack3, breadcrumbs: false },
    { id: 3, title: 'Permintaan Barang', type: 'item', url: '/permintaan-barang', icon: icons.IconShoppingCartPlus, breadcrumbs: false },
    { id: 4, title: 'Barang Masuk', type: 'item', url: '/barang-masuk', icon: icons.IconStackPush, breadcrumbs: false },
    { id: 5, title: 'Barang Keluar', type: 'item', url: '/barang-keluar', icon: icons.IconStackPop, breadcrumbs: false },
    { id: 6, title: 'Laporan Barang Masuk', type: 'item', url: '/laporan-barang-masuk', icon: icons.IconPackageImport, breadcrumbs: false },
    { id: 7, title: 'Laporan Barang Keluar', type: 'item', url: '/laporan-barang-keluar', icon: icons.IconPackageExport, breadcrumbs: false },
    { id: 8, title: 'User', type: 'item', url: '/user', icon: icons.IconUser, breadcrumbs: false },
    { id: 9, title: 'Abensi Saya', type: 'item', url: '/absensi-saya', icon: icons.IconClipboardText, breadcrumbs: false },
  ]
};

export default pages;
