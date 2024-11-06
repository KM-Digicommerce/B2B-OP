// src\components\Dealer\DealerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../../Dealer/sidebar';
import NotificationBar from '../../Dealer/NotificationBar';
import DealerHome from './DealerHome';
import Products from '../Products/ProductList';
import Orders from '../orders/orderList';

const DealerDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
         <Sidebar />
         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
         <NotificationBar />
           <Routes>
             <Route path="/" element={<DealerHome/>} />
             <Route path="orders" element={<Orders />} />
             <Route path="products" element={<Products />} />
           </Routes>
         </Box>
       </Box>
      
  );
};

export default DealerDashboard;
