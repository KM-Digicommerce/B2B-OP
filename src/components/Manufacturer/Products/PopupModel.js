// src\components\Manufacturer\Products\PopupModal.js
import React from 'react';
import { Modal, Box, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const PopupModal = ({ open, onClose }) => { // Changed handleClose to onClose
  const navigate = useNavigate();

  const handleGeneralImport = () => {
    onClose(); // Close the modal
    navigate('/manufacturer/products/import'); // Navigate to the import page
  };

  const handlePersonalImport = () => {
    onClose(); // Close the modal
    navigate('/manufacturer/products/personalimport'); // Navigate to the personal import page
  };

  return (
    <Modal
      open={open}
      onClose={onClose} // Updated here
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={onClose} // Updated here
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Import Options
        </Typography>
        <Button onClick={handleGeneralImport} variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
          General Import
        </Button>
        <Button onClick={handlePersonalImport} variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
          Personal Import
        </Button>
      </Box>
    </Modal>
  );
};

export default PopupModal;
