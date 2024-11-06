import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Logout from '../Login/Logout';
import { Dashboard,Receipt, ShoppingCart, People, Settings, ExitToApp } from '@mui/icons-material'; // Import icons

const drawerWidth = 200;

const Sidebar = () => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer">
                        <Dashboard sx={{ mr: 2 }} /> {/* Dashboard Icon */}
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/orders">
                        <Receipt  sx={{ mr: 2 }} /> {/* Orders Icon */}
                        <ListItemText primary="Orders" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/products">
                        <ShoppingCart  sx={{ mr: 2 }} /> {/* Products Icon */}
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/dealerList">
                        <People sx={{ mr: 2 }} /> {/* Dealers Icon */}
                        <ListItemText primary="Dealers" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/settings">
                        <Settings sx={{ mr: 2 }} /> {/* Settings Icon */}
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <Box sx={{ mt: 'auto', mb: 2, px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton component={Logout}>
                        <ExitToApp sx={{ mr: 2 }} /> {/* Logout Icon */}
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
