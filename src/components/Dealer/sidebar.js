
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
                    <ListItemButton component={Link} to="/dealer"> 
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/dealer/products"> 
                        <ListItemText primary="Browse Products" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/dealer/orders"> 
                        <ListItemText primary="My Orders" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton> 
                        <ListItemText primary="My Staffs" />
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
                    <ListItemButton component={Logout}> 
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
