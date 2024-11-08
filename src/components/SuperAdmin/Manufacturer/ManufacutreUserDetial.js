import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ManufactureUserDetail() {
  const { id } = useParams(); // Get the manufacture unit ID from the URL
  const [product, setProduct] = useState(null); // Holds product details if available
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [editableFields, setEditableFields] = useState({
    name: '',
    location: '',
    description: '',
    logo: null
  }); // Store field values for editing
  const [selectedLogo, setSelectedLogo] = useState(null); // To hold selected logo file URL
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (id) { // If ID exists, fetch existing manufacturer details
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_IP}obtainManufactureUnitDetails/?manufacture_unit_id=${id}`
          );
          const productData = response.data.data.manufacture_unit_obj || {};
          setProduct(productData);
          setEditableFields(productData); // Initialize editable fields with product data
          setSelectedLogo(productData.logo); // Set logo URL for preview
        } catch (err) {
          console.error("Error fetching product details:", err);
          setError('Failed to fetch product details');
        }
      };

      fetchProduct();
    }
  }, [id]);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  // Handle logo file change
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get the base64 string
        setSelectedLogo(reader.result); // Preview the image (optional)
        handleFieldChange('logo', base64String); // Update the logo with base64 string
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Reset logo to null
  const resetLogo = () => {
    setSelectedLogo(null);
    handleFieldChange('logo', null); // Set logo to null when reset
  };

  // Save changes
  const saveChanges = async () => {
    try {
      // If no new logo is selected, retain the existing logo or send null if logo is removed
      const logoToSend = selectedLogo ? selectedLogo : editableFields.logo || '';
  
      const data = {
        manufacture_unit_id: id || '', 
        manufacture_unit_obj: {
          name: editableFields.name,
          description: editableFields.description,
          location: editableFields.location,
          logo: logoToSend, // Send the logo as base64 string or existing logo or empty string if removed
        }
      };
  
      if (id) {
        // If ID exists, update the manufacturer (use PUT for updating, not POST)
        await axios.post(
          `${process.env.REACT_APP_IP}createORUpdateManufactureUnit/`,
          data,
          {
            headers: {
              'Content-Type': 'application/json', // Use JSON format for params
            },
          }
        );
      } else {
        // If no ID (creating new manufacturer), send data as new product
        await axios.post(
          `${process.env.REACT_APP_IP}createORUpdateManufactureUnit/`,
          data, // Send the data object for a new manufacturer
          {
            headers: {
              'Content-Type': 'application/json', // Use JSON format for params
            },
          }
        );
      }
      navigate('/super_admin/manufacturerList/'); // Navigate back to the manufacturer list
      setProduct(editableFields); // Update product with new values
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Error saving changes:", err);
      setError('Failed to save changes');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h3>{id ? 'Manufacturer User Detail' : 'Add New Manufacturer'}</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', width: '150px' }}>Logo:</label>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="file"
                  accept="image/*" // Restrict file selection to images
                  onChange={handleLogoChange} // Handle file selection
                  style={{ flex: 1, padding: '5px' }}
                />
                {selectedLogo && (
                  <img
                    src={selectedLogo} // Display base64 logo for preview
                    alt="Selected logo"
                    style={{ width: '50px', height: '50px', marginLeft: '10px', borderRadius: '50%' }}
                  />
                )}
              </div>
            ) : (
              product?.logo ? (
                <img
                  src={product.logo} // Show base64 string logo directly in non-edit mode
                  alt={`${product.name} logo`}
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              ) : (
                <span>No Logo</span>
              )
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', width: '150px' }}>Name:</label>
            <input
              type="text"
              value={editableFields.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              style={{ flex: 1, padding: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', width: '150px' }}>Location:</label>
            <input
              type="text"
              value={editableFields.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              style={{ flex: 1, padding: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', width: '150px' }}>Description:</label>
            <textarea
              value={editableFields.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              style={{ flex: 1, padding: '5px', minHeight: '100px' }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={saveChanges}
              style={{
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
              }}
            >
              Save
            </button>

            <button
              style={{
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                marginLeft: '10px',
              }}
            >
              <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/super_admin/manufacturerList/">
                Cancel
              </Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManufactureUserDetail;
