// src\components\Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <button style={{
      backgroundColor: '#f44336', 
      color: 'white',              
      border: 'none',              
      borderRadius: '4px',        
      padding: '10px 20px',       
      cursor: 'pointer',           
      fontSize: '16px',          
      transition: 'background-color 0.3s', 
    }}  onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
