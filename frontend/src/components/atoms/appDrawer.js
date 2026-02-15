import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import {AppRoutes} from "../../routes/appRoutes";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function AppDrawer() {
    const navigate = useNavigate();

    const handleMenuItemClick = (menuItem) => {
        navigate(menuItem.path);
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {AppRoutes.map((route, index) => {
                    const Icon = route.icon;

                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => handleMenuItemClick(route)}>
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={route.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

export default AppDrawer;
