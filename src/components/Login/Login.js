// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import './Login.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_IP}loginUser/`, { email, password });
      const { data } = response.data;

      console.log('API Response:', data);

      if (data.valid) {
        localStorage.setItem('token', data._c1);
        localStorage.setItem('user', JSON.stringify(data));

        console.log('User Role:', data.role_name);

        switch (data.role_name) {
          case 'super_admin':
            navigate('/super_admin');
            break;
          case 'dealer_admin':
            navigate('/dealer');
            break;
            case 'dealer_user':
              navigate('/dealer');
              break;
          case 'manufacturer_admin':
            navigate('/manufacturer');
            break;

            case 'manufacturer_user':
              navigate('/manufacturer');
              break;
          default:
            alert('Role not recognized');
            navigate('/login');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Server Error');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Adjust the path to your forgot password page
  };

  return (
    <Box display="flex" height="100vh">
      {/* Left side */}
      <Box className="login-page" flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center"  px={5}>
        <Typography variant="h4" color="textPrimary" gutterBottom>
          B2B Ordering Platform
        </Typography>
        <Typography variant="body1" color="textSecondary" padding={'20px'} align="center">
        B2B Ordering Platform streamlines business operations for manufacturers, distributors, and dealers with easy catalog management, efficient order processing, and seamless logistics integration. It enhances visibility, communication, and performance across all parties, driving sales and operational efficiency.
        </Typography>
      </Box>

      {/* Right side */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="100%" maxWidth="400px" mx="auto" px={3}>
          <Typography variant="h5" color="textPrimary" gutterBottom>
            Sign In
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Typography
            variant="body2"
            color="primary"
            style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
          >
            Forgot Password?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
          >
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
