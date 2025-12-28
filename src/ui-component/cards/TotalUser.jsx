import PropTypes from 'prop-types';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from './MainCard';
import TotalIncomeCard from './Skeleton/TotalIncomeCard';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Poppins } from '../typography/Poppins';
import { IconUser } from '@tabler/icons-react';
import DashboardLogic from '../../views/dashboard/Default/DashboardLogic';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.vars.palette.primary.dark, // background
  color: theme.vars.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.vars.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`, // gradasi bawah
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.vars.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`, // gradasi atas
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function TotalUser({ isLoading }) {
  const { value } = DashboardLogic();
  const theme = useTheme();

  return (
    <>
      {value.loadingGet ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  {/* icon */}
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.largeAvatar,
                      borderRadius: 2,
                      bgcolor: 'primary.800', // background icon
                      color: 'common.white' // warna icon
                    }}
                  >
                    <IconUser />
                    {/* <TableChartOutlinedIcon fontSize="inherit" /> */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={
                    // title jumlah user
                    <Poppins component="span" variant="h4" sx={{ color: 'common.white' }}>
                      {value?.data.totalUser}
                    </Poppins>
                  }
                  secondary={
                    // title total user
                    <Poppins component="span" variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                      Total User
                    </Poppins>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
}

TotalUser.propTypes = { isLoading: PropTypes.bool };
