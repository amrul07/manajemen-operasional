// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  // roles: ['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa'],
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false,
      // roles: ['Pimpinan', 'Staff', 'Karyawan Pelapor', 'Karyawan Biasa']
    }
  ]
};

export default dashboard;
