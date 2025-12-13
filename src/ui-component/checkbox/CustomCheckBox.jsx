import { Checkbox, Stack } from '@mui/material';
import React from 'react';

export default function CustomCheckBox({ onChange, checked }) {
  return (
    <Stack
      sx={{
        backgroundColor: '#e3f2fd',
        width: '38px',
        height: '35px',
        borderRadius: '8px',
        justifyContent: 'center',
        ':hover': { backgroundColor: '#1e88e5' }
      }}
    >
      <Checkbox
        checked={checked}
        onChange={onChange}
        sx={{
          '& .MuiSvgIcon-root': { fontSize: 28 },
          color: '#1e88e5',
          '&.Mui-checked': {
            color: '#1e88e5'
          },
          ':hover': {
            color: '#fff'
          }
        }}
      />
    </Stack>
  );
}
