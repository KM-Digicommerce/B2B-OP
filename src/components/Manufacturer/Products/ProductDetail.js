import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  IconButton,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const initialEditMode = new URLSearchParams(location.search).get('edit') === 'true';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isEditMode, setIsEditMode] = useState(initialEditMode); // Control edit mode state

  // State for editable fields
  const [product_name, setName] = useState('');
  const [long_description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [model, setModel] = useState('');
  const [mpn, setMpn] = useState('');
  const [discount, setDiscount] = useState('');
  const [upcEan, setUpcEan] = useState('');
  const [quantity, setQuantity] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_IP}obtainProductDetails/?project_id=${id}`);
        setProduct(response.data.data || {});
        setMainImage(response.data.data.logo || ''); // Set default main image
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setName(product.product_name || '');
      setDescription(product.long_description || '');
      setSku(product.sku_number_product_code_item_number || '');
      setModel(product.model || '');
      setMpn(product.mpn || '');
      // Convert discount to string before calling replace
      setDiscount((product.discount?.toString() || '').replace('%', '') || '');
      setUpcEan(product.upc_ean || '');
      setQuantity(product.quantity || '');
      setColor(product.attributes?.Color || '');
      setWeight(product.attributes?.Weight || '');
      setSize(product.attributes?.Size || '');
      setAvailability(product.availability || false);
    }
  }, [product]);
  
  const handleCancel = () => {
    navigate('/manufacturer/products');
  };

  const handleSave = async () => {
    try {
      const updatedProduct = {
        id,
        sku_number_product_code_item_number: sku,
        model,
        mpn,
        discount: Number(discount), // Convert to number
        upc_ean: upcEan,
        quantity: Number(quantity), // Convert to number
        attributes: {
          Color: color,
          Size: size,
          Weight: weight,
        },
        availability,
        currency: product.currency, // Original currency
        long_description: long_description, // Updated description
        product_name: product_name, // Updated name
        list_price: product.list_price, // Original list price
        images: product.images, // Original images
        features: product.features, // Original features
      };

      await axios.post(`${process.env.REACT_APP_IP}updateProduct/`, updatedProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the state with new values
      setProduct(prev => ({ ...prev, ...updatedProduct }));
      setIsEditMode(false); // Disable edit mode after saving
    } catch (error) {
      setError('Failed to update product');
    }
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <Paper sx={{ padding: 4, maxWidth: 1200, margin: 'auto', mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button variant="outlined" onClick={handleCancel}>Back</Button>
        <IconButton component={Link} to={`/manufacturer/products/details/${id}?edit=true`} onClick={() => setIsEditMode(true)}>
          <Edit />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardMedia 
              component="img" 
              height="400" 
              image={mainImage} 
              alt={product?.product_name} 
            />
          </Card>
          <Box display="flex"  gap={1} mt={2} >
            {product?.product_image_list?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index}`}
                style={{ width: '80px', height: '100px', cursor: 'pointer', border: '1px solid #ccc' }}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </Box>
          <Box display="flex" gap={1} mt={2} flexWrap={'wrap'}>
            {product?.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index}`}
                style={{ width: '80px', height: '100px', cursor: 'pointer', border: '1px solid #ccc' }}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>{product?.product_name}</Typography>
              <Typography variant="h6" color="text.primary">
                {product?.currency}{product?.list_price}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>{product?.short_description}</Typography>
              <Box display="flex" gap={2} mt={2}>
                {product?.availability ? (
                  <Button variant="contained" color="secondary">In Stock</Button>
                ) : (
                  <Button variant="contained" color="primary">Out Of Stock</Button>
                )}
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h6">Product Details</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>{product?.long_description}</Typography>

          <Box sx={{ mt: 2 }}>
            {isEditMode ? (
              <>
                <TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} fullWidth />
                <TextField label="Model" value={model} onChange={(e) => setModel(e.target.value)} fullWidth />
                <TextField label="MPN" value={mpn} onChange={(e) => setMpn(e.target.value)} fullWidth />
                <TextField label="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} fullWidth />
                <TextField label="UPC/EAN" value={upcEan} onChange={(e) => setUpcEan(e.target.value)} fullWidth />
                <TextField
                  label="Stock Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  fullWidth
                />
                <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} fullWidth />
                <TextField label="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} fullWidth />
                <TextField label="Size" value={size} onChange={(e) => setSize(e.target.value)} fullWidth />
          
              </>
            ) : (
              <>
                <Typography variant="subtitle1">SKU: {sku}</Typography>
                <Typography variant="subtitle1">Model: {model}</Typography>
                <Typography variant="subtitle1">MPN: {mpn}</Typography>
                <Typography variant="subtitle1">Discount: {discount}%</Typography>
                <Typography variant="subtitle1">UPC/EAN: {upcEan}</Typography>
                <Typography variant="subtitle1">
                  Availability: {availability ? 'In Stock' : 'Out of Stock'}
                </Typography>
                <Typography variant="subtitle1">Stock Quantity: {quantity}</Typography>
                <Typography variant="subtitle1">Color: {color}</Typography>
                <Typography variant="subtitle1">Weight: {weight}</Typography>
                <Typography variant="subtitle1">Size: {size}</Typography>
              </>
            )}
          </Box>

          {isEditMode && (
            <Box mt={2}>
              <TextField label="Name" value={product_name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Description" value={long_description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline />
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>Save</Button>
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductDetail;
