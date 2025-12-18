import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';

import Logo from '../../../ui-component/Logo';
import AuthFooter from '../../../ui-component/cards/AuthFooter';
// import AuthLogin from '../auth-forms/AuthLogin';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import CustomFormControl from '../../../ui-component/extended/Form/CustomFormControl';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { Alert, Button, CircularProgress, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar } from '@mui/material';
import UseAuthenticationLogic from './AuthenticationLogic';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function Login() {
  const { value, func } = UseAuthenticationLogic();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));


  return (
    <AuthWrapper1>
      <Stack sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
          <Box sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            <AuthCardWrapper>
              <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Poppins variant={downMD ? 'h3' : 'h2'} sx={{ color: 'primary.main' }}>
                    Hi, Selamat Datang
                  </Poppins>
                  <Poppins variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                    Enter your credentials to continue
                  </Poppins>
                </Stack>
                {/* form login */}
                <Box sx={{ width: 1 }}>
                  <CustomFormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-email-login" sx={{ fontFamily: `'Poppins', sans-serif` }}>
                      Nomor Wa
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email-login"
                      name="no_hp"
                      value={value.data.no_hp}
                      onChange={func.handleChange}
                      sx={{ fontFamily: `'Poppins', sans-serif` }}
                    />
                  </CustomFormControl>

                  <CustomFormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password-login" sx={{ fontFamily: `'Poppins', sans-serif` }}>
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-login"
                      type={value.showPassword ? 'text' : 'password'}
                      value={value.data.password}
                      onChange={func.handleChange}
                      name="password"
                      sx={{ fontFamily: `'Poppins', sans-serif` }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={func.handleShowPassword}
                            onMouseDown={func.handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {value.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </CustomFormControl>

                  <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                      {/* <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label="Keep me logged in"
          /> */}
                    </Grid>
                    <Grid>
                      <Poppins
                        variant="subtitle1"
                        // component={Link}
                        // to="/verifikasi-noHp"
                        onClick={func.handleLupaPassword}
                        sx={{ textDecoration: 'none', color: 'primary.main',cursor: 'pointer' }}
                      >
                        Lupa Password?
                      </Poppins>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                      <Button
                        color="primary"
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{ fontFamily: `'Poppins', sans-serif` }}
                        onClick={func.loginHandler}
                      >
                        Sign In
                        {value.loading === true && (
                          <CircularProgress
                            size={18}
                            sx={{
                              color: '#FFF',
                              ml: '5px'
                            }}
                          />
                        )}
                      </Button>
                    </AnimateButton>
                  </Box>
                </Box>
                <Divider sx={{ width: 1 }} />
                {/* <Stack sx={{ alignItems: 'center' }}>
                  <Typography component={Link} to="/pages/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    Don&apos;t have an account?
                  </Typography>
                </Stack> */}
              </Stack>
            </AuthCardWrapper>
          </Box>
        </Stack>
        <Box sx={{ px: 3, my: 3 }}>{/* <AuthFooter /> */}</Box>
        {/* snackbar */}
        <Snackbar
          open={value.snackbar.open}
          // autoHideDuration={5000}
          onClose={func.closeSnackbar}
          // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={func.closeSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontFamily: `'Poppins', sans-serif` }}>
            {value.snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </AuthWrapper1>
  );
}
