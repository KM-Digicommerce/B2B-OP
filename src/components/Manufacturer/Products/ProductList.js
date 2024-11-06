import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, IconButton, CircularProgress, Box, MenuItem, Select, FormControl, Checkbox, Button,
  TablePagination, Tooltip
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PopupModal from './PopupModel';

function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [editedPrices, setEditedPrices] = useState({});
  const [editedVisibility, setEditedVisibility] = useState({});
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [isBulkEdit, setIsBulkEdit] = useState(false);
  const fetchData = async () => {
    try {
      const userData = localStorage.getItem('user');
      let manufactureUnitId = '';
      if (userData) {
        const data = JSON.parse(userData);
        manufactureUnitId = data.manufacture_unit_id;
      }

      const categoryResponse = await axios.get(`${process.env.REACT_APP_IP}obtainProductCategoryList/?manufacture_unit_id=${manufactureUnitId}`);
      setCategories(categoryResponse.data.data || []);
      
      const productResponse = await axios.get(`${process.env.REACT_APP_IP}obtainProductsList/?manufacture_unit_id=${manufactureUnitId}`);
      setItems(productResponse.data.data || []);
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenBulkEdit = () => {
    setIsBulkEditing((prev) => !prev);
    setSelectedItems((prev) => (prev.size === items.length ? new Set() : new Set(items.map(item => item.id))));
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleClose = () => {
    setIsBulkEditing(false);
    setSelectedItems(new Set());
    setEditedPrices({});
    setEditedVisibility({});
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = async (event) => {
    const selectedCategory = event.target.value;
    setFilter(selectedCategory);
    try {
      const userData = localStorage.getItem('user');
      let manufactureUnitId = '';
      if (userData) {
        const data = JSON.parse(userData);
        manufactureUnitId = data.manufacture_unit_id;
      }

      const response = await axios.get(`${process.env.REACT_APP_IP}obtainProductsList/?manufacture_unit_id=${manufactureUnitId}${selectedCategory ? `&product_category_id=${selectedCategory}` : ''}`);
      setItems(response.data.data || []);
    } catch (err) {
      setError('Failed to load filtered items');
      console.error(err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };


  // const handleSelectItem = (id) => {
  //   const newSelectedItems = new Set(selectedItems);
  //   if (newSelectedItems.has(id)) {
  //     newSelectedItems.delete(id);
  //   } else {
  //     newSelectedItems.add(id);
  //   }
  //   setSelectedItems(newSelectedItems);
  // };

  const handlePriceChange = (id, value) => {
    setEditedPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleToggleVisibility = (id) => {
    setEditedVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBulkEditSubmit = async () => {
    const productList = Array.from(selectedItems).map((id) => {
      const editedPrice = editedPrices[id];
      const originalPrice = items.find(item => item.id === id)?.price;
      const isVisible = editedVisibility[id] !== undefined ? editedVisibility[id] : items.find(item => item.id === id)?.visible;

      return (editedPrice !== undefined || editedVisibility[id] !== undefined) ? {
        id,
        list_price: Number(editedPrice) || originalPrice,
        visible: isVisible,
      } : null;
    }).filter(item => item !== null);

    if (productList.length === 0) {
      console.warn('No edited prices to submit.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_IP}updateBulkProduct/`, { product_list: productList });
      setSelectedItems(new Set());
      setEditedPrices({});
      setEditedVisibility({});
      setIsBulkEditing(false);
      fetchData(); // Refetch the data after bulk edit
    } catch (err) {
      console.error('Failed to submit bulk edit', err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? item.category === filter : true;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ margin: '2%' }}>
      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
        <Button onClick={handleOpenBulkEdit} variant="outlined"   color="primary" style={{ marginLeft: '10px', fontSize: '12px',  textTransform: 'capitalize' }}>
          {isBulkEditing ? 'Cancel Bulk Edit' : 'Bulk Edit'}
        </Button>
        <Button onClick={handleBulkEditSubmit}  variant="outlined" color="secondary" style={{ marginLeft: '10px', fontSize: '12px',  textTransform: 'capitalize' }} disabled={!isBulkEditing}>
          Submit Bulk Edit
        </Button>
        <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
  <Select value={filter} onChange={handleFilterChange} displayEmpty size="small">
    <MenuItem value="" sx={{padding: '4px 10px'}}>
      <span style={{ fontSize: '12px',padding: '4px'  }}>All Categories</span>
    </MenuItem>
    {categories.map((category) => (
      <MenuItem key={category.id} value={category.id} >
        {category.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<TextField
  variant="outlined"
  placeholder="Search..."
  value={searchTerm}
  onChange={handleSearchChange}
  size="small"
  sx={{ width: 300, marginLeft: 2 }}
  InputProps={{
    style: { fontSize: '11px' },
  }}
/>

     <Tooltip title="Import File" arrow>
  <IconButton color="primary" style={{ marginLeft: '10px' }} onClick={handleOpenPopup}>
    <FileUploadOutlinedIcon
      sx={{
        fontSize: '40px',
        color: '#1976d2',
      }}
    />
  </IconButton>
</Tooltip>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Product Image</TableCell>
              <TableCell>SKU Number</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>End Level Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Visibility</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id}>

                
<TableCell>
        <Checkbox
          checked={selectedItems.has(item.id)}
          onChange={() => handleSelectItem(item.id)}
          color="primary"
          size="small"
          disabled={!isBulkEditing}  // Bulk edit not enabled then checkbox disabled
        />
      </TableCell>
                <TableCell>
                  <Link to={`/manufacturer/products/details/${item.id}`}>
                    <img src={item.logo}  style={{ width: 50, height: 'auto' }} />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link style={{textDecoration: 'none', color:'inherit'}} to={`/manufacturer/products/details/${item.id}`}>{item.sku_number}</Link>
                </TableCell>
                <TableCell>
  <Link 
    to={`/manufacturer/products/details/${item.id}`} 
    style={{ 
      display: 'inline-block', 
      textDecoration: 'none',
      color: 'inherit',
      maxWidth: '200px', // or adjust the value based on your design
      whiteSpace: 'nowrap', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis',
      fontSize: '12px' // optional for consistent font size
    }}
  >
    {item.name}
  </Link>
</TableCell>

                <TableCell>{item.brand_name}</TableCell>
                <TableCell>{item.end_level_category}</TableCell>
                <TableCell>
                  {isBulkEditing ? (
                    <input
                      type="number"
                      value={editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    />
                  ) : (
                    item.price
                  )}
                </TableCell>
                <TableCell>
                  {isBulkEditing ? (
                    <IconButton onClick={() => handleToggleVisibility(item.id)}>
                      {editedVisibility[item.id] !== undefined ? (
                        editedVisibility[item.id] ? <Visibility /> : <VisibilityOff />
                      ) : (
                        item.visible ? <Visibility /> : <VisibilityOff />
                      )}
                    </IconButton>
                  ) : (
                    item.visible ? <Visibility /> : <VisibilityOff />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />
      {isPopupOpen && <PopupModal onClose={() => setIsPopupOpen(false)} />}
        
      <PopupModal open={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}

export default ProductList;
