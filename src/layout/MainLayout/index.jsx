import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { lazy } from 'react';
import { Suspense } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
// import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContentStyled from './MainContentStyled';
import Customization from '../Customization';
import Loader from '../../ui-component/Loader';
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs';
import Loadable from '../../ui-component/Loadable';

import useConfig from '../../hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from '../../api/menu';

import { useLocation } from 'react-router-dom';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const Footer = Loadable(lazy(() => import('./Footer')));

  const [showFooter, setShowFooter] = useState(false);
  const location = useLocation();

  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const {
    state: { borderRadius, miniDrawer }
  } = useConfig();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  useEffect(() => {
    handlerDrawerOpen(!miniDrawer);
  }, [miniDrawer]);

  useEffect(() => {
    downMD && handlerDrawerOpen(false);
  }, [downMD]);

  useEffect(() => {
    setShowFooter(false);

    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // horizontal menu-list bar : drawer

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* header */}
      <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.default' }}>
        <Toolbar sx={{ p: 2 }}>
          <Header />
        </Toolbar>
      </AppBar>

      {/* menu / drawer */}
      <Sidebar />

      {/* main content */}
      <MainContentStyled {...{ borderRadius, open: drawerOpen }}>
        <Box sx={{ ...{ px: { xs: 0 } }, minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}>
          {/* breadcrumb */}
          <Breadcrumbs />
          {/* CONTENT */}
          <Suspense fallback={<Loader />}>
            <Box sx={{ flex: 1 }}>
              <Outlet />
            </Box>
          </Suspense>

          {/* FOOTER */}
          {showFooter && <Footer />}
        </Box>
      </MainContentStyled>
      {/* <Customization /> */}
    </Box>
  );
}
