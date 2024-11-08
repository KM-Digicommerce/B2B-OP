// src/components/SuperAdmin/Dashboard/SuperAdminHome.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdminHome = () => {
  const [ setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(`${process.env.REACT_APP_IP}obtainManufactureUnitList/`);
        console.log('9090',categoryResponse)
        setCategories(categoryResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='dashboard'>
      <h3>SuperAdminHome Dashboard</h3>
      {/* <ul>
        {categories.map((category, index) => (
          <li key={index}>{category.name}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default SuperAdminHome;
