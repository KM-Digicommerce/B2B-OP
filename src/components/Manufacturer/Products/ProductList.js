import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Pagination,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PopupModal from "./PopupModel";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [editedPrices, setEditedPrices] = useState({});
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [visibility, setVisibility] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  const fetchData = async () => {
    try {
      const userData = localStorage.getItem("user");
      let manufactureUnitId = "";

      if (userData) {
        const data = JSON.parse(userData);
        manufactureUnitId = data.manufacture_unit_id;
      }

      const categoryResponse = await axios.get(
        `${process.env.REACT_APP_IP}obtainProductCategoryList/?manufacture_unit_id=${manufactureUnitId}`
      );
      setCategories(categoryResponse.data.data || []);

      const productResponse = await axios.get(
        `${process.env.REACT_APP_IP}obtainProductsList/?manufacture_unit_id=${manufactureUnitId}`
      );
      setItems(productResponse.data.data || []);
    } catch (err) {
      setError("Failed to load items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVisibility = (id) => {
    setVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenBulkEdit = () => {
    setIsBulkEditing((prev) => !prev);
    setSelectedItems((prev) =>
      prev.size === items.length
        ? new Set()
        : new Set(items.map((item) => item.id))
    );
  };

  const handleClose = () => {
    setIsBulkEditing(false);
    setSelectedItems(new Set());
    setEditedPrices({});
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = async (event) => {
    const selectedCategory = event.target.value;
    setFilter(selectedCategory);
    try {
      const userData = localStorage.getItem("user");
      let manufactureUnitId = "";

      if (userData) {
        const data = JSON.parse(userData);
        manufactureUnitId = data.manufacture_unit_id;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_IP}obtainProductsList/?manufacture_unit_id=${manufactureUnitId}${selectedCategory ? `&product_category_id=${selectedCategory}` : ""}`
      );
      setItems(response.data.data || []);
    } catch (err) {
      setError("Failed to load filtered items");
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

  const handlePriceChange = (id, value) => {
    setEditedPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBulkEditSubmit = async () => {
    const productList = Array.from(selectedItems)
      .map((id) => {
        const editedPrice = editedPrices[id];
        const originalPrice = items.find((item) => item.id === id)?.price;

        return editedPrice !== undefined && editedPrice !== originalPrice
          ? {
              id,
              list_price: Number(editedPrice),
            }
          : null;
      })
      .filter((item) => item !== null);

    if (productList.length === 0) {
      console.warn("No edited prices to submit.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_IP}updateBulkProduct/`,
        { product_list: productList },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Refresh the data after successful submission
      await fetchData();
      handleClose();
    } catch (err) {
      console.error("Failed to update prices", err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter ? item.category === filter : true;

    return matchesSearch && matchesFilter;
  });

  const paginatedItems = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-dashboard" style={{ margin: "2%" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <IconButton
            color="primary"
            style={{ marginLeft: "10px" }}
            onClick={handleOpenPopup}
          >
            <FileUploadOutlinedIcon
              sx={{
                fontSize: "40px",
                color: "#1976d2",
              }}
            />
          </IconButton>
        </Box>
        <Box>
          <Button
            onClick={handleOpenBulkEdit}
            sx={{ textTransform: "capitalize" }}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "10px" , fontSize:"12px" }}
          >
            {isBulkEditing ? "Cancel Bulk Edit" : "Bulk Edit"}
          </Button>
          <Button
            onClick={handleBulkEditSubmit}
            sx={{ textTransform: "capitalize" }}
            variant="outlined"
            color="secondary"
            style={{ marginLeft: "10px" , fontSize:"12px" }}
            disabled={!isBulkEditing}
          >
            Submit Bulk Edit
          </Button>
        </Box>

        <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
          <Select
            value={filter}
            onChange={handleFilterChange}
            displayEmpty
            size="small"
          >
            <MenuItem value="">
              <em>All Categories</em>
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
          sx={{ width: 200 }}
        />
      </Box>

      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
              <TableCell sx={{ fontWeight: "bold" , width:'120px' }}>Product Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" , width:'220px' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>SKU Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell sx={{width:'120px' }}>
                    <Link  to={`/manufacturer/products/details/${item.id}`}>
                      <img
                        src={item.logo}
                        alt={item.name}
                        style={{ width: 50, height: "auto" }}
                      />
                    </Link>
                  </TableCell>
                  <TableCell sx={{ width:'220px' }}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }}  to={`/manufacturer/products/details/${item.id}`}>
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.sku_number
                      ? item.sku_number.substring(0, 80)
                      : "No sku_number available"}
                  </TableCell>
                  <TableCell>
                    {item.brand_name ? item.brand_name.substring(0, 80) : "N/A"}
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      value={
                        selectedItems.has(item.id) && isBulkEditing
                          ? editedPrices[item.id] !== undefined
                            ? editedPrices[item.id]
                            : item.price
                          : item.price
                      }
                      onChange={(e) =>
                        handlePriceChange(item.id, e.target.value)
                      }
                      size="small"
                      sx={{ width: 80 }}
                      disabled={!selectedItems.has(item.id) || !isBulkEditing}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleToggleVisibility(item.id)}>
                      {visibility[item.id] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredItems.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ padding: 2, display: "flex", justifyContent: "center" }}
        />
      </TableContainer>

      {/* Popup Modal Component */}
      <PopupModal open={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}

export default ProductList;
