// src\components\Manufacturer\Orders\OrderList.js

import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  MenuItem,
  IconButton,
  Checkbox,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { styled } from "@mui/material/styles";
import "../../Manufacturer/manufacturer.css";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// Styled TextField
const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "5px",
    },
    "& input": {
      height: "20px",
      padding: "8px", // Set custom padding
      fontSize: "12px", // Adjust font size for input
    },
  },
}));

// Styled Dealer Menu
const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    maxHeight: "400px",
    width: "300px",
    overflowY: "auto",
    fontSize: "12px",
  },
}));

const OrderList = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentColumn, setCurrentColumn] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [delivery_status, setdelivery_status] = useState("all");
  const [fulfilled_status, setfulfilled_status] = useState("all");
  const [payment_status, setpayment_status] = useState("all");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [dealerAnchorEl, setDealerAnchorEl] = useState(null);
  const [selectedDealerIds, setSelectedDealerIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);


  const handleRowClick = (orderId) => {
    navigate(`/manufacturer/order-details/${orderId}`); // Navigate to the OrderDetail page with orderId
  };

  useEffect(() => {
    fetchDealers(); // Fetch dealers on component mount
  }, [user.manufacture_unit_id]);

  const fetchDealers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_IP}obtainDealerlist/`,
        {
          params: { manufacture_unit_id: user.manufacture_unit_id },
        }
      );
      // console.log(response.data.data);
      // Set dealers with both username and id
      setDealers(
        response.data.data.map((dealer) => ({
          id: dealer.id,
          username: dealer.username,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [
    user.manufacture_unit_id,
    searchTerm,
    sortConfig,
    page,
    rowsPerPage,
  ]);

  const fetchOrders = async () => {
    if (!user || !user.manufacture_unit_id) {
      console.error("User or manufacture_unit_id is not defined.");
      return;
    }

    try {
    // Check the selectedDate before formatting it
    console.log("Selected Date before formatting:", selectedDate);
      
    // Ensure selectedDate is a valid Dayjs object
    const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

    // Log the formatted date
    console.log("Sending selected date:", formattedDate);

      const response = await axios.post(
        `${process.env.REACT_APP_IP}obtainOrderList/`,
        {
          manufacture_unit_id: user.manufacture_unit_id,
          search_query: searchTerm,
          sort_by: sortConfig.key,
          sort_by_value: sortConfig.direction === "asc" ? 1 : -1,
          page,
          rows_per_page: rowsPerPage,
          dealer_list: selectedDealerIds,
          delivery_status : delivery_status,
          fulfilled_status : fulfilled_status,
          payment_status : payment_status,
          search_by_date: formattedDate,
        }
      );
      setOrders(response.data.data);
      console.log(response.data.data);
      console.log("selectedDealerIds :", selectedDealerIds);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(0); // Reset to the first page when sorting changes
    fetchOrders(); // Fetch orders immediately after sorting
    setAnchorEl(null);
  };


  const handleOpenMenu = (event, column) => {
    setCurrentColumn(column);
    setAnchorEl(event.currentTarget);
  };

  const handleOpenExportMenu = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExportMenu = () => {
    setExportAnchorEl(null);
  };

  const handleExport = async (status) => {
    const exportUrl = `${process.env.REACT_APP_IP}exportOrders/`; // Changed variable name to exportUrl
    const params = {
      manufacture_unit_id: user.manufacture_unit_id,
      status,
    };

    try {
      const response = await axios.get(exportUrl, {
        params,
        responseType: "blob",
      }); // Use exportUrl here
      const blobUrl = window.URL.createObjectURL(new Blob([response.data])); // Changed to blobUrl
      const link = document.createElement("a");
      link.href = blobUrl; // Use blobUrl here
      link.setAttribute("download", `orders_${status}.xlsx`); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting orders:", error);
    }

    handleCloseExportMenu();
  };

  const handleDealerSelection = (event, dealer) => {
    const selected = event.target.checked
      ? [...selectedDealerIds, dealer.id] // Use dealer.id
      : selectedDealerIds.filter((id) => id !== dealer.id);
    setSelectedDealerIds(selected);
  };

  const handleCheckboxChange = (event, dealer) => {
    handleDealerSelection(event, dealer); // Call the modified function here
  };

  const handleOpenDealerDropdown = (event) => {
    setDealerAnchorEl(event.currentTarget);
  };

  const handleCloseDealerDropdown = () => {
    setDealerAnchorEl(null);
  };

  const handleApplyDealers = () => {
    // This can include additional logic if needed when applying dealer selection
    handleCloseDealerDropdown();
    fetchOrders(); // Fetch orders again after applying dealer selection
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ p: 1, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            pb: 2,
            gap: 2,
          }}
        >
          <Button
            sx={{
              border: "1px solid #1976d2",
              textTransform: "capitalize",
              fontSize: "12px",
            }}
            onClick={handleOpenDealerDropdown}
          >
            View Orders By Dealer Name
          </Button>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
        
          value={selectedDate}
          onChange={(newDate) => {
            console.log("Selected Date after change:", newDate);
            setSelectedDate(newDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </DemoContainer>
      
      {/* Button to manually trigger fetchOrders */}
      <Button variant="contained" color="primary" onClick={fetchOrders}>
        Fetch Orders
      </Button>
    </LocalizationProvider>

          <CustomTextField
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 0,
              width: "300px",
            }}
            placeholder="Search by Order ID or Dealer Name"
          />

          {/* Export Button */}
          <Tooltip title="Export" arrow>
            <IconButton onClick={handleOpenExportMenu} sx={{ padding: 0 }}>
              <FileDownloadOutlinedIcon
                sx={{
                  fontSize: "40px",
                  color: "#1976d2",
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  OrderId
                  <IconButton onClick={(e) => handleOpenMenu(e, "_id")}>
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Dealer Name
                  <IconButton onClick={(e) => handleOpenMenu(e, "dealer_name")}>
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Destination
                  <IconButton onClick={(e) => handleOpenMenu(e, "destination")}>
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Total Items
                  <IconButton onClick={(e) => handleOpenMenu(e, "total_items")}>
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Order Value
                  <IconButton onClick={(e) => handleOpenMenu(e, "amount")}>
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Order Date
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, "creation_date")}
                  >
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Payment Status
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, "payment_status")}
                  >
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Fulfillment Status
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, "fulfillment_status")}
                  >
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  Delivery Status
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, "delivery_status")}
                  >
                    <MoreVertIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell align="center">{order.order_id}</TableCell>
                  <TableCell align="center">{order.dealer_name}</TableCell>
                  <TableCell align="center">{order.address.city},{order.address.country}</TableCell>
                  <TableCell align="center">{order.total_items}</TableCell>
                  <TableCell align="center">{order.amount}</TableCell>
                  <TableCell align="center">{new Date(order.creation_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{order.payment_status}</TableCell>
                  <TableCell align="center">{order.fulfilled_status}</TableCell>
                  <TableCell align="center">{order.delivery_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[25, 50, 75]}
          component="div"
          count={orders.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Show"
        />
      </Box>

      {/* Menu for sorting and filtering options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {currentColumn === "_id" && (
          <>
            <MenuItem onClick={() => handleSort("_id", "asc")}>
              Sort by Ascending
            </MenuItem>
            <MenuItem onClick={() => handleSort("_id", "desc")}>
              Sort by Descending
            </MenuItem>
          </>
        )}
        {currentColumn === "dealer_name" && (
          <>
            <MenuItem onClick={() => handleSort("dealer_name", "asc")}>
              Sort A-Z
            </MenuItem>
            <MenuItem onClick={() => handleSort("dealer_name", "desc")}>
              Sort Z-A
            </MenuItem>
          </>
        )}
        {currentColumn === "amount" && (
          <>
            <MenuItem onClick={() => handleSort("amount", "asc")}>
              Sort Low to High
            </MenuItem>
            <MenuItem onClick={() => handleSort("amount", "desc")}>
              Sort High to Low
            </MenuItem>
          </>
        )}
       
        {currentColumn === "creation_date" && (
          <>
            <MenuItem onClick={() => handleSort("creation_date", "asc")}>
              Sort Oldest to Newest
            </MenuItem>
            <MenuItem onClick={() => handleSort("creation_date", "desc")}>
              Sort Newest to Oldest
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Dealer Selection Dropdown */}
      <StyledMenu
        anchorEl={dealerAnchorEl}
        open={Boolean(dealerAnchorEl)}
        onClose={handleCloseDealerDropdown}
      >
        {dealers.map((dealer) => (
          <MenuItem
            key={dealer.id}
            sx={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <Checkbox
              checked={selectedDealerIds.indexOf(dealer.id) > -1} // Check against selectedDealerIds
              onChange={(event) => handleCheckboxChange(event, dealer)} // Use the handler
            />
            <ListItemText primary={dealer.username} />
          </MenuItem>
        ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
            position: "sticky",
            bottom: 16,
          }}
        >
          <Button
            sx={{ margin: "10px" }}
            variant="contained"
            onClick={handleApplyDealers}
          >
            Apply
          </Button>
        </Box>
      </StyledMenu>

      {/* Export menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleCloseExportMenu}
      >
        <MenuItem onClick={() => handleExport("all")}>
          Export All Orders
        </MenuItem>
        <MenuItem onClick={() => handleExport("pending")}>
          Export Pending Orders
        </MenuItem>
        <MenuItem onClick={() => handleExport("shipped")}>
          Export Shipped Orders
        </MenuItem>
        <MenuItem onClick={() => handleExport("completed")}>
          Export Completed Orders
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OrderList;
