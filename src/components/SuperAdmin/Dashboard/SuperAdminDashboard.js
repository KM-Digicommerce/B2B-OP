// src\components\SuperAdmin\Dashboard\SuperAdminDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../sidebar';
import SuperAdminHome from './SuperAdminHome';
import  NotificationBar from '../NotificationBar';
import ManufacturerList from '../Manufacturer/ManufacturerList';
import SettingHome from '../Settings/SettingHome';
import DealerList from '../Dealers/DealerList';
// import ManufacutreUserDetial from '../Manufacturer/ManufacutreUserDetial';
// src/components/SuperAdmin/Dashboard/SuperAdminDashboard.js
import ManufacutreUserDetial from '../../SuperAdmin/Manufacturer/ManufacutreUserDetial';
import DealerDetail from '../../SuperAdmin/Dealers/DealerDetail';
const SuperAdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    <NotificationBar />
      <Routes>
        <Route path="/" element={<SuperAdminHome/>} />
        <Route path="manufacturerList" element={<ManufacturerList/>} />
        <Route path="manufacturerList/details/:id" element={< ManufacutreUserDetial/>} /> 
        <Route path="manufacturerList/details/" element={< ManufacutreUserDetial/>} /> 
        <Route path="dealerList/details/:id" element={<DealerDetail/>} />
        <Route path="dealerList" element={<DealerList/>}/>
        <Route path="settings" element={<SettingHome/>} />
      </Routes>
    </Box>
  </Box>
  );
};

export default SuperAdminDashboard;
