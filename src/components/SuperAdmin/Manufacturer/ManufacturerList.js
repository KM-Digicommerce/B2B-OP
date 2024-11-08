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
