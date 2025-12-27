import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import PopularCard from './PopularCard';
import TotalAbsen from './TotalAbsen';
import TotalPermintaanBarang from './TotalPermintaanBarang';
import TotalUser from '../../../ui-component/cards/TotalUser';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalBarang';
import TotalBarangMasukKeluar from './TotalBarangMasukKeluar';

import { gridSpacing } from '../../../store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Value } from 'sass';
import DashboardLogic from './DashboardLogic';
import ButtonStyle from '../../../ui-component/button/ButtonStyle';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const { value, func } = DashboardLogic();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          {/* total absen hari ini */}
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalAbsen isLoading={isLoading} />
          </Grid>
          {/* total permintaan barang */}
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalPermintaanBarang isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              {/* total user */}
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalUser isLoading={isLoading} />
              </Grid>
              {/* total barang */}
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          {/* total barang masuk & keluar */}
          <Grid size={{ xs: 12, md: 12 }}>
            <TotalBarangMasukKeluar isLoading={isLoading} />
          </Grid>
          {/* <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
        </Grid>
      </Grid>
      {/* alert izin notifikasi */}
      <Dialog open={value.open}>
        <DialogTitle sx={{ fontFamily: `'Poppins', sans-serif` }}>🔔 Notifikasi Absensi</DialogTitle>
        <DialogContent sx={{ fontFamily: `'Poppins', sans-serif` }}>Apakah kamu ingin menerima notifikasi absensi?</DialogContent>
        <DialogActions sx={{ justifyContent: 'space-around' }}>
          <ButtonStyle
            width={'45%'}
            height={'40px'}
            bg={'#1e88e5'}
            color={'#fff'}
            hover={'#1b71bcff'}
            onClick={func.handleEnableNotification}
          >
            Iya{' '}
            {value.loadingDialog === true && (
              <CircularProgress
                size={18}
                sx={{
                  color: '#FFF',
                  position: 'absolute',
                  mt: '5px',
                  ml: '5px'
                }}
              />
            )}
          </ButtonStyle>
          <ButtonStyle
            width={'45%'}
            height={'40px'}
            bg={'#fff'}
            color={'#1e88e5'}
            // hover={'#1b71bcff'}
            onClick={() => {
              localStorage.setItem('fcm-consent-shown', 'true');
              value.setOpen(false);
            }}
          >
            Tidak
          </ButtonStyle>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
