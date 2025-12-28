import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../../ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from '../../../assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

import { Poppins } from '../../../ui-component/typography/Poppins';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import DashboardLogic from './DashboardLogic';

export default function TotalPermintaanBarang({ isLoading }) {
  const { value } = DashboardLogic();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {value.loadingGet ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'warning.dark', // background
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.warning[800], // gradasi kanan
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.warning[800], // gradasi kiri
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.largeAvatar,
                  borderRadius: 2,
                  bgcolor: 'warning.800', // background icon
                  mt: 1
                }}
              >
                <IconShoppingCartPlus color="#fff" /> {/* icon */}
                {/* <CardMedia sx={{ width: 30, height: 30 }} component="img" src={EarningIcon} alt="Notification" /> */}
              </Avatar>
              {/* <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  bgcolor: 'warning.dark',
                  color: 'warning.200',
                  zIndex: 1
                }}
                aria-controls="menu-earning-card"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon fontSize="inherit" />
              </Avatar> */}
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              {/* title jumlah permintaan barang */}
              <Poppins sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                {value?.data.totalPermintaanBarang}
              </Poppins>
              <Avatar sx={{ ...theme.typography.smallAvatar, bgcolor: 'warning.200', color: 'warning.dark' }}>
                <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
              </Avatar>
            </Stack>
            {/* titel total permintaan barang */}
            <Poppins
              sx={{
                mb: 1.25,
                fontSize: '1rem',
                fontWeight: 500,
                color: 'warning.200'
              }}
            >
              Total Permintaan Barang
            </Poppins>
          </Box>
        </MainCard>
      )}
    </>
  );
}

TotalPermintaanBarang.propTypes = { isLoading: PropTypes.bool };
