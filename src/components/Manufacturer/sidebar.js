// Update in src/components/Manufacturer/sidebar.js

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
                    <ListItemButton component={Link} to="/manufacturer"> {/* Dashboard Link */}
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/orders"> {/* Orders Link */}
                        <ListItemText primary="Orders" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/products"> {/* Products Link */}
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/manufacturer/dealerList"> 
                        <ListItemText primary="Dealers" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <Box sx={{ mt: 'auto', mb: 2, px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton component={Logout}> {/* Add Logout button here */}
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
