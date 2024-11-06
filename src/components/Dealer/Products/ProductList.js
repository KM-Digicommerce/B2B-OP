import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');
        let manufactureUnitId = '';

        if (userData) {
          const data = JSON.parse(userData);
          manufactureUnitId = data.manufacture_unit_id;
        }

        // Fetch categories
        const categoryResponse = await axios.get(`http://192.168.1.15:8000/app/obtainProductCategoryList/?manufacture_unit_id=${manufactureUnitId}`);
        setCategories(categoryResponse.data.data || []);
        console.log('Categories:', categoryResponse.data.data || []); // Log categories

        // Fetch products
        const productResponse = await axios.get(`http://192.168.1.15:8000/app/obtainProductsList/?manufacture_unit_id=${manufactureUnitId}`);
        setItems(productResponse.data.data || []);
        console.log('Products:', productResponse.data.data || []); // Log products
      } catch (err) {
        setError('Failed to load items');
        console.error(err); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div>
      <h2>Product List</h2>
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
      <h3>Products</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
