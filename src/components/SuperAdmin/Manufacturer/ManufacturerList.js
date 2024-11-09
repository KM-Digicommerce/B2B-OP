// src/components/Manufacturer/Dealers/ManufacturerList.js

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogContent,
  TableContainer,
  TablePagination,
  Paper,
} from "@mui/material";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import AddNewManufacture from './AddNewManufacture';

// Styled TextField for search input
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '5px',
    },
    '& input': {
      height: '20px',
      padding: '8px',
      fontSize: '12px',
    },
  }
}));

function ManufacturerList() {
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch manufacturer units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_IP}obtainManufactureUnitList/`);
        setUnits(response.data.data.manufacture_unit_list || []);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };
    fetchUnits();
  }, []);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 2, flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: 2 }}>
        {/* <Button
          sx={{ border: '1px solid #1976d2', textTransform: 'capitalize' }}
          onClick={() => setOpen(true)}
        >
          Add New Manufacturer Unit
        </Button> */}

<Button
  sx={{ border: '1px solid #1976d2', textTransform: 'capitalize' }}
  component={Link}
  to={`/super_admin/manufacturerList/details`}
>
  Add New Manufacturer Unit
</Button>


        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
          <DialogContent>
            <AddNewManufacture />
          </DialogContent>
        </Dialog>

        <CustomTextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 0, width: '300px' }}
          placeholder="Search by Manufacturer ID or Manufacturer name"
        />
      </Box>

      {/* Manufacturer Listing Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Logo</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {units
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((unit) => (
                  <tr key={unit.id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                      <Link to={`/super_admin/manufacturerList/details/${unit.id}`}>
                        <img
                          src={unit.logo}
                          alt={`${unit.name} logo`}
                          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                      </Link>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <Link to={`/super_admin/manufacturerList/details/${unit.id}`}>{unit.name}</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={units.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default ManufacturerList;



// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   TextField,
//   TableContainer,
//   TablePagination,
//   Paper,
// } from "@mui/material";
// import axios from 'axios';
// import { styled } from '@mui/material/styles';

// // Placeholder image URL for default user image
// const DEFAULT_LOGO = 'path/to/default/user/image.png';

// // Styled TextField for search input
// const CustomTextField = styled(TextField)(({ theme }) => ({
//   '& .MuiOutlinedInput-root': {
//     '& fieldset': {
//       borderRadius: '5px',
//     },
//     '& input': {
//       height: '20px',
//       padding: '8px',
//       fontSize: '12px',
//     },
//   }
// }));

// function ManufacturerList() {
//   const [units, setUnits] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [editingManufacturer, setEditingManufacturer] = useState(null);
//   const [manufacturerData, setManufacturerData] = useState({
//     name: '',
//     location: '',
//     description: '',
//     logo: DEFAULT_LOGO,
//   });

//   // Fetch manufacturer units
//   const fetchUnits = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_IP}obtainManufactureUnitList/`);
//       setUnits(response.data.data.manufacture_unit_list || []);
//     } catch (error) {
//       console.error("Error fetching units:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUnits();
//   }, []);

//   // Handle pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle field changes for manufacturer inputs
//   const handleFieldChange = (field, value) => {
//     setManufacturerData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle logo file selection
//   const handleLogoChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setManufacturerData((prev) => ({ ...prev, logo: reader.result.split(',')[1] }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Save or Update Manufacturer
//   const handleSave = async () => {
//     try {
//       const data = {
//         manufacture_unit_id: editingManufacturer ? editingManufacturer.id : '',
//         manufacture_unit_obj: {
//           name: manufacturerData.name,
//           location: manufacturerData.location,
//           description: manufacturerData.description,
//           logo: manufacturerData.logo || DEFAULT_LOGO,
//         },
//       };

//       await axios.post(`${process.env.REACT_APP_IP}createORUpdateManufactureUnit/`, data, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       setEditingManufacturer(null);
//       setManufacturerData({ name: '', location: '', description: '', logo: DEFAULT_LOGO });
//       fetchUnits(); // Refresh list after save
//     } catch (error) {
//       console.error("Error saving manufacturer:", error);
//     }
//   };

//   // Edit Manufacturer
//   const handleEdit = (manufacturer) => {
//     setEditingManufacturer(manufacturer);
//     setManufacturerData({
//       name: manufacturer.name,
//       location: manufacturer.location,
//       description: manufacturer.description,
//       logo: manufacturer.logo || DEFAULT_LOGO,
//     });
//   };

//   return (
//     <Box sx={{ p: 2, flexGrow: 1 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: 2 }}>
        
//         {/* Input fields for adding/editing manufacturer */}
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             label="Name"
//             variant="outlined"
//             size="small"
//             value={manufacturerData.name}
//             onChange={(e) => handleFieldChange('name', e.target.value)}
//           />
//           <TextField
//             label="Location"
//             variant="outlined"
//             size="small"
//             value={manufacturerData.location}
//             onChange={(e) => handleFieldChange('location', e.target.value)}
//           />
//           <TextField
//             label="Description"
//             variant="outlined"
//             size="small"
//             value={manufacturerData.description}
//             onChange={(e) => handleFieldChange('description', e.target.value)}
//           />
//           <Button
//             variant="contained"
//             component="label"
//             sx={{ textTransform: 'capitalize' }}
//           >
//             Upload Logo
//             <input
//               type="file"
//               hidden
//               accept="image/*"
//               onChange={handleLogoChange}
//             />
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             sx={{ textTransform: 'capitalize' }}
//           >
//             {editingManufacturer ? 'Update' : 'Save'}
//           </Button>
//         </Box>

//         {/* Search field */}
//         <CustomTextField
//           variant="outlined"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ flexGrow: 0, width: '300px' }}
//           placeholder="Search by Manufacturer ID or Manufacturer name"
//         />
//       </Box>

//       {/* Manufacturer Listing Table */}
//       <Box sx={{ overflowX: 'auto' }}>
//         <TableContainer component={Paper}>
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//             <thead>
//               <tr>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Logo</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {units
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((unit) => (
//                   <tr key={unit.id}>
//                     <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
//                       <img
//                         src={unit.logo || DEFAULT_LOGO}
//                         alt={`${unit.name} logo`}
//                         style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//                       />
//                     </td>
//                     <td style={{ padding: "10px", border: "1px solid #ddd" }}>{unit.name}</td>
//                     <td style={{ padding: "10px", border: "1px solid #ddd" }}>
//                       <Button onClick={() => handleEdit(unit)} variant="outlined">Edit</Button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </TableContainer>
//       </Box>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={units.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Box>
//   );
// }

// export default ManufacturerList;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Avatar,
//   TableContainer,
//   TablePagination,
// } from '@mui/material';
// import axios from 'axios';

// const DEFAULT_LOGO = 'path/to/default/user/image.png';

// const ManufacturerList = () => {
//   const [manufacturerData, setManufacturerData] = useState({
//     name: '',
//     location: '',
//     description: '',
//     logo: '',
//   });
//   const [editingManufacturer, setEditingManufacturer] = useState(null);
//   const [units, setUnits] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const handleFieldChange = (field, value) => {
//     setManufacturerData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleLogoChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setManufacturerData((prev) => ({ ...prev, logo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     const data = {
//       manufacture_unit_id: editingManufacturer ? editingManufacturer.id : '',
//       manufacture_unit_obj: {
//         name: manufacturerData.name,
//         description: manufacturerData.description,
//         location: manufacturerData.location,
//         logo: manufacturerData.logo || DEFAULT_LOGO,
//       },
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_IP}createORUpdateManufactureUnit/`,
//         data,
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       fetchUnits(); // Refresh the list after save
//       handleCancel(); // Clear fields and exit edit mode
//     } catch (err) {
//       console.error("Error saving manufacturer:", err);
//     }
//   };

//   const handleEdit = (manufacturer) => {
//     setEditingManufacturer(manufacturer);
//     setManufacturerData({
//       name: manufacturer.name,
//       location: manufacturer.location,
//       description: manufacturer.description,
//       logo: manufacturer.logo || DEFAULT_LOGO,
//     });
//   };

//   const handleCancel = () => {
//     setEditingManufacturer(null);
//     setManufacturerData({ name: '', location: '', description: '', logo: DEFAULT_LOGO });
//   };

//   const fetchUnits = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_IP}obtainManufactureUnitList/`);
//       setUnits(response.data.data.manufacture_unit_list || []);
//     } catch (error) {
//       console.error("Error fetching units:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUnits();
//   }, []);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper elevation={3} sx={{ p: 3, mb: 3, height: '150px' }}>
//         <Typography variant="h6" gutterBottom>
//           {editingManufacturer ? 'Edit Manufacturer' : 'Add New Manufacturer'}
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               size="small"
//               fullWidth
//               value={manufacturerData.name}
//               onChange={(e) => handleFieldChange('name', e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Location"
//               variant="outlined"
//               size="small"
//               fullWidth
//               value={manufacturerData.location}
//               onChange={(e) => handleFieldChange('location', e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <TextField
//                 label="Description"
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 multiline
//                 rows={1}
//                 value={manufacturerData.description}
//                 onChange={(e) => handleFieldChange('description', e.target.value)}
//               />
//               <Button variant="contained" component="label" sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Avatar
//                   src={manufacturerData.logo || DEFAULT_LOGO}
//                   alt="Logo"
//                   sx={{ width: 56, height: 56, mr: 1 }}
//                 />
//                 Upload Logo
//                 <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSave}
//                 sx={{ textTransform: 'capitalize', height: 'fit-content' }}
//               >
//                 {editingManufacturer ? 'Update' : 'Save'}
//               </Button>
//               {editingManufacturer && (
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={handleCancel}
//                   sx={{ textTransform: 'capitalize', height: 'fit-content' }}
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Manufacturer Listing Table */}
//       <Box sx={{ overflowX: 'auto' }}>
//         <TableContainer component={Paper}>
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//             <thead>
//               <tr>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Logo</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {units.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((unit) => (
//                 <tr key={unit.id}>
//                   <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
//                     <img
//                       src={unit.logo || DEFAULT_LOGO}
//                       alt={`${unit.name} logo`}
//                       style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//                     />
//                   </td>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{unit.name}</td>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>
//                     <Button onClick={() => handleEdit(unit)} variant="outlined">Edit</Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </TableContainer>
//       </Box>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={units.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Box>
//   );
// };

// export default ManufacturerList;
