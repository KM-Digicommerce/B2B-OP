import React from 'react';
import { Box, Grid, TextField, Button, Typography, MenuItem, Switch, Paper } from '@mui/material';

const SettingsPage = () => {
  const textFieldStyles = {
    marginY: '12px',
    fontSize: '12px',
    '& .MuiInputBase-root': {
      fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px',
    },
    '& .MuiInputBase-input': {
      fontSize: '12px',
    },
  };

  return (
    <Box sx={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
        Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Edit Profile Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' }}>
              Edit Profile
            </Typography>
            <TextField
              fullWidth
              label="Your Name"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter your name',
              }}
            />
            <TextField
              fullWidth
              label="Store Name"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter your store name',
              }}
            />
            <TextField
              select
              fullWidth
              label="Location"
              defaultValue="United States"
              sx={textFieldStyles}
            >
              <MenuItem value="United States">United States</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Currency"
              defaultValue="US Dollar ($)"
              sx={textFieldStyles}
            >
              <MenuItem value="US Dollar ($)">US Dollar ($)</MenuItem>
              <MenuItem value="Euro (€)">Euro (€)</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Email"
              defaultValue="kim@gmail.com"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter your email',
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              defaultValue="01978536547"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter your phone number',
              }}
            />
            <TextField
              fullWidth
              label="Address"
              defaultValue="813 Howard Street,Seoul, 13126, Korea"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter your address',
              }}
            />
          </Paper>
        </Grid>

        {/* Change Password Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' }}>
              Change Password
            </Typography>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter current password',
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Enter new password',
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              sx={textFieldStyles}
              InputProps={{
                placeholder: 'Confirm new password',
              }}
            />
          </Paper>
        </Grid>

        {/* Notifications Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' }}>
              Notifications
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginY: '12px' }}>
              <Typography sx={{ fontSize: '12px' }}>Order Confirmation</Typography>
              <Switch defaultChecked />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginY: '12px' }}>
              <Typography sx={{ fontSize: '12px' }}>Order Status Changed</Typography>
              <Switch />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginY: '12px' }}>
              <Typography sx={{ fontSize: '12px' }}>Order Delivered</Typography>
              <Switch defaultChecked />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginY: '12px' }}>
              <Typography sx={{ fontSize: '12px' }}>Email Notification</Typography>
              <Switch defaultChecked />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box textAlign="right" sx={{ marginTop: '30px' }}>
        <Button variant="contained" color="primary" sx={{ fontSize: '12px', padding: '8px 20px' }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
