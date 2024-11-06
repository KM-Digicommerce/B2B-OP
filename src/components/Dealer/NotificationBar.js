// src\components\Dealer\NotificationBar.js

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NotificationBar = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '10px 20px',
      position: 'relative',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '3px',
      margin:'3px'
    }}>
      <Typography variant="h6">B2B-OP Dealer</Typography>  
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton sx={{ color: 'white' }}>
          <NotificationsIcon />
        </IconButton>
        <IconButton sx={{ color: 'white' }}>
          <AccountCircleIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NotificationBar;
