import React, { useState, useEffect } from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ProductModal from "./ProductModal"; // Import the ProductModal component

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
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
          `${process.env.REACT_APP_IP}obtainProductsListForDealer/?manufacture_unit_id=${manufactureUnitId}`
        );
        setProducts(productResponse.data.data || []);
      } catch (err) {
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div style={{ margin: "10px" }}>
      <ul
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "35px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((category) => (
          <li
            style={{
              listStyle: "none",
              fontWeight: "400",
              borderRadius: "5px",
              padding: "5px 8px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            key={category.id}
          >
            {category.name}
          </li>
        ))}
      </ul>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        marginBottom={"15px"}
      >
        <Button sx={{ p: 0, textTransform: "none" }}>Product Filter</Button>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          <Button sx={{ p: 0, textTransform: "none" }}>Availability</Button>
          <Button sx={{ p: 0, textTransform: "none" }}>Sort by: Price</Button>
          <Button sx={{ p: 0, textTransform: "none" }}>
            Sort by: Bestselling
          </Button>
          <Button sx={{ p: 0, textTransform: "none" }}>
            {products.length} Products
          </Button>
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="space-between"
      >
        {products.map((product) => (
          <Box
            key={product.id}
            width={{
              xs: "100%",
              sm: "calc(50% - 24px)",
              md: "calc(20% - 24px)",
            }}
            mb={3}
          >
            <Card>
              <Box position="relative">
                <CardMedia
                  component="img"
                  height="140"
                  image={product.logo || "https://via.placeholder.com/150"}
                  alt={product.name}
                />
                {product.discount > 0 && (
                  <Box
                    position="absolute"
                    bottom={8}
                    left={8}
                    bgcolor="primary.main"
                    color="white"
                    px={1}
                    py={0.5}
                    borderRadius={1}
                    zIndex={1}
                    fontSize={8}
                  >
                    {`${product.discount}% OFF`}
                  </Box>
                )}

                <Tooltip title="Quick View" arrow>
                  <AddOutlinedIcon
                    size="small"
                    variant="contained"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "#fff",
                      color: "#000",
                      fontSize: "8px",
                      zIndex: 1,
                      borderRadius: "50%",
                      border: "1px solid",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpen(product)}
                  />
                </Tooltip>
              </Box>
              <CardContent>
                <Typography variant="subtitle1">
                  {product.name.length > 15
                    ? `${product.name.slice(0, 15)}...`
                    : product.name}
                </Typography>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Typography variant="body2" color="text.secondary">
                    {product.currency}
                    {product.price}
                  </Typography>
                  {product.was_price && product.discount > 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textDecoration: "line-through" }}
                    >
                      MRP {product.currency}
                      {product.was_price}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <ProductModal
        open={open}
        onClose={handleClose}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductList;
