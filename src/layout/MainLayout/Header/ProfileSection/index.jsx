import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import UpgradePlanCard from './UpgradePlanCard';
import MainCard from '../../../../ui-component/cards/MainCard';
import Transitions from '../../../../ui-component/extended/Transitions';
import useConfig from '../../../../hooks/useConfig';
import { Poppins } from '../../../../ui-component/typography/Poppins';

// assets
import User1 from '../../../../assets/images/users/user-round.svg';
import { IconBrandWhatsapp, IconBriefcase, IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import AuthenticationLogic from '../../../../views/pages/authentication/AuthenticationLogic';
import { fetchData } from '../../../../api/api';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const { func } = AuthenticationLogic();
  const theme = useTheme();
  const {
    state: { borderRadius }
  } = useConfig();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    getProfile();
  }, []);

  // get data profile
  const getProfile = async () => {
    try {
      const res = await fetchData(`/me`);
      setData(res.data);
    } catch (error) {}
  };

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px' }}
        icon={
          <Avatar
            src={User1}
            alt="user-images"
            sx={{ typography: 'mediumAvatar', margin: '8px 0 8px 8px !important', cursor: 'pointer' }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      <Divider />
                      {data && (
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 350,
                            minWidth: 100,
                            borderRadius: `${borderRadius}px`,
                            '& .MuiListItemButton-root': { mt: 0.5 }
                          }}
                        >
                          {/* nama */}
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText primary={<Poppins variant="body2">{data.name}</Poppins>} />
                          </ListItemButton>
                          {/* jabatan */}
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                            <ListItemIcon>
                              <IconBriefcase stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText primary={<Poppins variant="body2">{data.jabatan}</Poppins>} />
                          </ListItemButton>
                          {/* no hp */}
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                            <ListItemIcon>
                              <IconBrandWhatsapp stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText primary={<Poppins variant="body2">{data.no_hp}</Poppins>} />
                          </ListItemButton>
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText onClick={func.handleLogout} primary={<Poppins variant="body2">Logout</Poppins>} />
                          </ListItemButton>
                        </List>
                      )}
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
