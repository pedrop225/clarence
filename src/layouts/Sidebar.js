// src/layouts/Sidebar.js
import React from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <>
      {/* Botón para abrir la barra lateral */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        edge="start"
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'primary.main',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Barra lateral */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        transitionDuration={300} // Opcional: ajustar duración de la transición
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/agentes-productivos">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Agentes Productivos" />
            </ListItem>
            {/* Puedes añadir más íconos y enlaces aquí */}
          </List>
          <Divider />
          {/* Más elementos de la barra lateral si es necesario */}
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;