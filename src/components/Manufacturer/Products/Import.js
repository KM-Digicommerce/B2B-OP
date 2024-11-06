// src\components\Manufacturer\Products\Import.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Import() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [xlData, setXlData] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name;

      if (!isValidExcelFile(fileType, fileName)) {
        setError('Please select a valid Excel file (.xls or .xlsx)');
        setFile(null);
      } else {
        setError('');
        setFile(selectedFile);
      }
    }
  };

  const isValidExcelFile = (fileType, fileName) => {
    return (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.ms-excel' ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx')
    );
  };

  const handleCancel = () => {
    resetState();
    navigate('/manufacturer/products');
  };

  const resetState = () => {
    setFile(null);
    setError('');
    setValidationMessage('');
    setCanSubmit(false);
    setXlData(null);
  };

  const handleSubmit = async () => {
    if (!xlData) return;

    const manufactureUnitId = getManufactureUnitId();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}save_file/`,
        { xl_data: xlData, manufacture_unit_id: manufactureUnitId }
      );

      if (response.data.status) {
        console.log('File submitted successfully:', response.data);
        navigate('/manufacturer/products');
      } else {
        console.error('Failed to submit file:', response.data.message);
      }
    } catch (err) {
      console.error('Error submitting file:', err.message);
    }
  };

  const getManufactureUnitId = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).manufacture_unit_id : '';
  };

  const handleValidate = async () => {
    if (!file) return;

    setLoading(true);
    setValidationMessage('');
    setCanSubmit(false);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        `${process.env.REACT_APP_IP}upload_file/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      handleValidationResponse(response);
    } catch (err) {
      setError('Failed to validate the file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidationResponse = (response) => {
    if (response.data.status) {
      const { xl_contains_error, xl_data } = response.data.data;

      if (xl_contains_error) {
        setValidationMessage('File contains errors. Please correct and revalidate.');
        setCanSubmit(false);
        setValidationData(response.data.data);
      } else {
        setValidationMessage('File is valid and ready for submission.');
        setCanSubmit(true);
        setXlData(xl_data);
      }
    } else {
      setValidationMessage('Validation failed: ' + response.data.message);
    }
  };

  useEffect(() => {
    if (validationData) {
      navigate('/manufacturer/products/validate', { state: { validationData } });
    }
  }, [validationData, navigate]);

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: 'auto', mt: 5, position: 'relative' }}>
      <Typography variant="h5" gutterBottom>
       General Import File
      </Typography>
      <IconButton color="error" onClick={handleCancel} sx={{ position: 'absolute', top: 16, right: 16 }}>
        <CancelIcon />
      </IconButton>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <CloudUploadIcon 
  sx={{ 
    fontSize: '2rem', 
    color: (theme) => theme.palette.primary.main, // Use the primary color from the theme
    marginRight: '8px', 
    width: '150px', 
    height: '150px' 
  }} 
/>

          <span style={{ color: 'grey', fontSize: '12px' }}>Please upload an Excel file (.xls or .xlsx)</span>
          <input
            id="file-upload"
            type="file"
            style={{ border: 'none', outline: 'none', display: 'none' }} // Keep input hidden
            onChange={handleFileChange}
          />
        </label>
      </Box>

      <TextField
        disabled
        fullWidth
        placeholder="No file selected"
        value={file ? file.name : ''}
        sx={{ flexGrow: 1 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {validationMessage && (
        <Alert severity={canSubmit ? "success" : "error"} sx={{ mb: 2 }}>
          <AlertTitle>{canSubmit ? "Success" : "Error"}</AlertTitle>
          {validationMessage}
        </Alert>
      )}

      <Box display="flex" style={{ justifyContent: 'center' }} mt={3}>
        {!canSubmit && (
          <Button 
            variant="outlined" 
            color="warning" 
            onClick={handleValidate} 
            disabled={loading}
            sx={{ textTransform: 'capitalize' }} // Apply text transform here
          >
            {loading ? <CircularProgress size={24} /> : 'Validate'}
          </Button>
        )}
        {canSubmit && (
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ textTransform: 'capitalize' }}>
            Submit
          </Button>
        )}
      </Box>
    </Paper>
  );
}

export default Import;
