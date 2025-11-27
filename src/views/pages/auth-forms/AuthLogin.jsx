import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Poppins } from '../../../ui-component/typography/Poppins';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const [checked, setChecked] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <CustomFormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-email-login" sx={{fontFamily: `'Poppins', sans-serif`}}>Nomor Wa</InputLabel>
        <OutlinedInput id="outlined-adornment-email-login" type="email" value="" name="email" sx={{fontFamily: `'Poppins', sans-serif`}} />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-password-login" sx={{fontFamily: `'Poppins', sans-serif`}}>Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value="123456"
          name="password"
          sx={{fontFamily: `'Poppins', sans-serif`}}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
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
          <Poppins variant="subtitle1" component={Link} to="#!" sx={{ textDecoration: 'none', color: 'primary.main' }}>
            Forgot Password?
          </Poppins>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="primary" fullWidth size="large" type="submit" variant="contained" sx={{fontFamily: `'Poppins', sans-serif`}}>
            Sign In
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
