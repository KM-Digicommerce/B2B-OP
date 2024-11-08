import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, IconButton, CircularProgress, Box, MenuItem, Select, FormControl, Checkbox, Button,
  TablePagination, Tooltip, Menu
} from '@mui/material';
import { Visibility, VisibilityOff, MoreVert as MoreVertIcon } from '@mui/icons-material';
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
  const [editedValues, setEditedValues] = useState({});
  const [editedVisibility, setEditedVisibility] = useState({});
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [setAvailabilityFilter] = useState('all');
  // const [ setAvailabilityFilter] = useState('all');

  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentColumn, setCurrentColumn] = useState("");


  const fetchData = async (filters = 'all') => {
    setLoading(true);
    try {
      const userData = localStorage.getItem('user');
      let manufactureUnitId = '';

      if (userData) {
        const data = JSON.parse(userData);
        manufactureUnitId = data.manufacture_unit_id;
      }

      const categoryResponse = await axios.get(`${process.env.REACT_APP_IP}obtainProductCategoryList/?manufacture_unit_id=${manufactureUnitId}&filters=${filters}`);
      setCategories(categoryResponse.data.data || []);

// Determine the sort_by_value based on sortConfig.direction
// const sort_by_value = sortConfig.direction === "asc" ? 1 : (sortConfig.direction === "desc" ? -1 : 0);
const productResponse = await axios.post(
  `${process.env.REACT_APP_IP}obtainProductsList/`,
  {
    manufacture_unit_id: manufactureUnitId,
    filters: filters,
    sort_by: sortConfig.key,  // Use the current column (key) from the state
    sort_by_value: sortConfig.direction === "asc" ? 1 : (sortConfig.direction === "desc" ? -1 : 0),  // Correctly pass the sort value
  }
);

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

  //open bulk edit
  const handleOpenBulkEdit = () => {
    setIsBulkEditing((prev) => !prev);
    setSelectedItems((prev) => (prev.size === items.length ? new Set() : new Set(items.map(item => item.id))));
  };

  //Import open popup
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  //Close popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // const handleClose = () => {
  //   setIsBulkEditing(false);
  //   setSelectedItems(new Set());
  //   setEditedVisibility({});
  // };

  //dropdown open menu
  const handleOpenMenu = (event, column) => {
    setAnchorEl(event.currentTarget);
    setCurrentColumn(column);  // Set column to either "price" or "availability"
  };

//Search event list
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //Categories
  const handleFilterChange = async (event) => {
    const selectedCategory = event.target.value;
    setFilter(selectedCategory);
    await fetchData(selectedCategory);
  };

  // Availability filter
  const handleSelectAvailability = async (availability) => {
    // setAvailabilityFilter(availability);
    handleCloseMenu();
    await fetchData(availability === 'In-stock' ? 'true' : availability === 'Out of stock' ? 'false' : 'all');
  };

  //pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //checkbox bulk edit
  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  //bulk edit price 
  const handleFieldChange = (id, field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  //bulk edit visibility status change
  const handleToggleVisibility = (id) => {
    setEditedVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  // //Sorting price List
  // const handleSort = (key, direction) => {
  //   console.log('909090', key, direction)
  //   setSortConfig({ key, direction });
  //   setPage(0);  // Reset to the first page when sorting changes
  //   fetchData(); // Refetch data based on new sorting
  //   setAnchorEl(null); // Close the sorting menu after selection
  // };

  
  const handleSort = (key, direction) => {
    console.log('Sorting with:', key, direction); // Log key and direction to verify it's being set correctly
    
    // Update the sorting configuration
    setSortConfig({ key, direction });
  
    // Reset to the first page when sorting changes
    setPage(0);
  
    // Call the fetchData function to fetch products with the new sort configuration
    fetchData();
  
    // Close the sorting menu
    setAnchorEl(null);
  };
// API request to fetch product data based on sorting and other filters



  //price select event lower to higer
  const handleSelectSort = (direction) => {
    console.log('decccc', direction)
    handleSort(currentColumn, direction); // Sort based on the current column and the selected direction
  };


  
  //Bulk edit submit functionality
  const handleBulkEditSubmit = async () => {
    const productList = Array.from(selectedItems).map((id) => {
      const editedFields = editedValues[id] || {};
      const originalItem = items.find((item) => item.id === id);
      const updatedItem = { id }; // Start with only the ID

      // Only add fields that have been edited and differ from the original values
      if (editedFields.price !== undefined && Number(editedFields.price) !== originalItem.price) {
        updatedItem.list_price = Number(editedFields.price);
      }
      if (editedFields.was_price !== undefined && Number(editedFields.was_price) !== originalItem.was_price) {
        updatedItem.was_price = Number(editedFields.was_price);
      }

      if (editedFields.msrp !== undefined && Number(editedFields.msrp) !== originalItem.msrp) {
        updatedItem.msrp = Number(editedFields.msrp);
      }
      if (editedVisibility[id] !== undefined && editedVisibility[id] !== originalItem.visible) {
        updatedItem.visible = editedVisibility[id];
      }

      return Object.keys(updatedItem).length > 1 ? updatedItem : null; // Include only if there are changes
    }).filter((item) => item !== null);

    if (productList.length === 0) {
      console.warn('No edited items to submit.');
      return;
    }
    //Bulk submit update api calling
    try {
      await axios.post(`${process.env.REACT_APP_IP}updateBulkProduct/`, { product_list: productList });
      setSelectedItems(new Set());
      setEditedValues({});
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

  if (error) return <div>{error}</div>;

  return (
    <div style={{ margin: '2%' }}>
      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
        <Button onClick={handleOpenBulkEdit} variant="outlined" color="primary" style={{ marginLeft: '10px', fontSize: '12px', textTransform: 'capitalize' }}>
          {isBulkEditing ? 'Cancel Bulk Edit' : 'Bulk Edit'}
        </Button>
        <Button onClick={handleBulkEditSubmit} variant="outlined" color="secondary" style={{ marginLeft: '10px', fontSize: '12px', textTransform: 'capitalize' }} disabled={!isBulkEditing}>
          Submit Bulk Edit
        </Button>
        <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
          <Select value={filter} onChange={handleFilterChange} displayEmpty size="small">
            <MenuItem value="" sx={{ padding: '4px 10px' }}>
              <span style={{ fontSize: '12px', padding: '4px' }}>All Categories</span>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
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
              {isBulkEditing && <TableCell>Select</TableCell>}
              <TableCell>Product Image</TableCell>
              <TableCell>SKU Number</TableCell>
              <TableCell>Product Name
              </TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>
                Availability
                <IconButton onClick={(e) => handleOpenMenu(e, "availability")}>
                  <MoreVertIcon sx={{ fontSize: "14px" }} />
                </IconButton>

              </TableCell>
              <TableCell>MPN</TableCell>
              <TableCell>MSRP</TableCell>
              <TableCell>Was Price</TableCell>
              <TableCell>Price
                <IconButton onClick={(e) => handleOpenMenu(e, "price")}>
                  <MoreVertIcon sx={{ fontSize: "14px" }} />
                </IconButton>
              </TableCell>
              <TableCell>Visibility</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <span style={{ paddingLeft: '45%' }} align="center">
                    <CircularProgress />
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow key={item.id}>
                  {isBulkEditing && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Link to={`/manufacturer/products/details/${item.id}`}>
                      <img src={item.logo} alt="Product Logo" style={{ width: 50, height: 'auto' }} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/manufacturer/products/details/${item.id}`}>
                      {item.sku_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/manufacturer/products/details/${item.id}`}
                      style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        color: 'inherit',
                        maxWidth: '200px',  // Adjust based on your design
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '12px'  // Optional for consistent font size
                      }}
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.brand_name}</TableCell>
                  <TableCell>{item.end_level_category}</TableCell>
                  <TableCell>{item.availability ? 'In-stock' : 'Out of stock'}</TableCell>
                  <TableCell>{item.mpn}
                  </TableCell>

                  <TableCell>
                    {isBulkEditing ? (
                      <input style={{ width: '80px' }}
                        type="number"
                        value={editedValues[item.id]?.msrp ?? item.msrp}
                        onChange={(e) => handleFieldChange(item.id, 'msrp', e.target.value)}
                      />
                    ) : (
                      item.msrp
                    )}
                  </TableCell>

                  <TableCell>
                    {isBulkEditing ? (
                      <input style={{ width: '80px' }}
                        type="number"
                        value={editedValues[item.id]?.was_price ?? item.was_price}
                        onChange={(e) => handleFieldChange(item.id, 'was_price', e.target.value)}
                      />
                    ) : (
                      item.was_price
                    )}
                  </TableCell>

                  <TableCell>
                    {isBulkEditing ? (
                      <input style={{ width: '80px' }}
                        type="number"
                        value={editedValues[item.id]?.price ?? item.price}
                        onChange={(e) => handleFieldChange(item.id, 'price', e.target.value)}
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
              ))
            )}
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {currentColumn === "price" && (
          <>
            <MenuItem onClick={() => handleSelectSort("asc")}>
              Sort Low to High
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("desc")}>
              Sort High to Low
            </MenuItem>
          </>
        )}
      {/* {currentColumn === "name" && (
          <>
            <MenuItem onClick={() => handleSort("name", "asc")}>
              Sort A-Z
            </MenuItem>
            <MenuItem onClick={() => handleSort("name", "desc")}>
              Sort Z-A
            </MenuItem>
          </>
        )} */}

        {currentColumn === "availability" && (
          <>
            <MenuItem sx={{ fontSize: '12px' }} onClick={() => handleSelectAvailability('all')}>
              All
            </MenuItem>
            <MenuItem sx={{ fontSize: '12px' }} onClick={() => handleSelectAvailability('In-stock')}>
              In Stock
            </MenuItem>
            <MenuItem sx={{ fontSize: '12px' }} onClick={() => handleSelectAvailability('Out of stock')}>
              Out of Stock
            </MenuItem>
          </>
        )}

      </Menu>


      {isPopupOpen && <PopupModal onClose={() => setIsPopupOpen(false)} />}

      <PopupModal open={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}


export default ProductList;
