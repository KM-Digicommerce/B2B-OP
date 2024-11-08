import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider,ListItemIcon } from '@mui/material';
import { Dashboard, Business, Storefront, Settings } from '@mui/icons-material';
import Logout from '../Login/Logout';

const drawerWidth = 240;

const Sidebar = () => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: 'background.paper',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            {/* Logo Section */}
            {/* <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                }}
            >
                <Avatar alt="Company Logo" src="/static/images/logo.png" sx={{ width: 56, height: 56 }} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Super Admin
                </Typography>
            </Box> */}

            <Divider />

            {/* Menu Items */}
            <List>
                {/* Dashboard */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/super_admin">
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                {/* Manufacturer */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/super_admin/manufacturerList">
                        <ListItemIcon>
                            <Business />
                        </ListItemIcon>
                        <ListItemText primary="Manufacturer" />
                    </ListItemButton>
                </ListItem>

                {/* Dealer */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/super_admin/dealerList">
                        <ListItemIcon>
                            <Storefront />
                        </ListItemIcon>
                        <ListItemText primary="Dealer" />
                    </ListItemButton>
                </ListItem>

                {/* Settings */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/super_admin/settings">
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            {/* Logout Section */}
            <Box sx={{ mt: 'auto', mb: 2, px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton component={Logout}>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
