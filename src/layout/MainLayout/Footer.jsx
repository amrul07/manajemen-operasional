import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import { Poppins } from '../../ui-component/typography/Poppins';

export default function Footer() {
  return (
    <Box sx={{ mt: 4,  }}>
      <Card
        sx={{
          height: '50px',
          alignContent: 'center'
        }}
      >
        <Poppins sx={{ fontWeight: 500,px:4 }}>
          Created by <span style={{ color: '#1e88e5' }}>Alif</span>
        </Poppins>
      </Card>
    </Box>
  );
}
