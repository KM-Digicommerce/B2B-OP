// src/components/Manufacturer/Dashboard/ManufacturerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../sidebar';
import ManufacturerHome from './ManufacturerHome'; 
import Orders from '../Orders/OrderList'; 
import Products from '../Products/ProductList';
import AddNewDealer from '../Dealers/AddNewDealer';
import DealerList from '../Dealers/DealerList';
import '../../Manufacturer/manufacturer.css';
import NotificationBar  from '../NotificationBar';
import ProductDetail from '../Products/ProductDetail';
import Import from '../Products/Import';
import PersonalImport from '../Products/PersonalImport';
import ImportValidate from '../Products/ImportValidate';
import DealerDetail from '../Dealers/DealerDetail';
import OrderDetail from '../Orders/OrderDetail';
// import SettingsPage from '../Settings/Settingspage';


const ManufacturerDashboard = () => {
  return (
 <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <NotificationBar />
        <Routes>
          <Route path="/" element={<ManufacturerHome />} />
         
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:dealer_name" element={<OrderDetail />} />

          
         
         
          <Route path="AddNewDealer" element={<AddNewDealer />} />
          <Route path="dealerList" element={<DealerList />} />
          <Route path="dealer-details/:orderId" element={<DealerDetail />} />

          <Route path="products" element={<Products />} />
          <Route path="products/details/:id" element={<ProductDetail />} /> 
          <Route path="products/import" element={<Import />} /> 
          
          <Route path="products/validate" element={<ImportValidate />} />
          <Route path="products/personalimport" element={<PersonalImport />} />
          {/* <Route path="settings" element={<SettingsPage />} /> */}
        </Routes>
      </Box>
    </Box>
   
  );
};

export default ManufacturerDashboard;
