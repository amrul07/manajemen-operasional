import * as React from 'react';
import { Modal, Box } from '@mui/material';

export default function CustomModal({ open, handleClose, children }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {xs:'80%',md:"30%"},
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    maxHeight: "95vh",
    overflowY: "auto"
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {children}
      </Box>
    </Modal>
  );
}
