// src/layouts/Sidebar.js
import React from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 60; // Ancho reducido para mostrar solo íconos

const menuItems = [
  { icon: <HomeIcon />, path: '/' },
  { icon: <BarChartIcon />, path: '/analysis' },
  { icon: <PeopleIcon />, path: '/agentes-productivos' },
  { icon: <SettingsIcon />, path: '/settings' },
  // Añade más items según tus necesidades
];

function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      {/* Botón para abrir/cerrar la barra lateral */}
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        onClick={toggleDrawer}
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

      {/* Drawer: Barra lateral */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Mejora el rendimiento en dispositivos móviles
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: '#333',
            border: 'none',
          },
        }}
      >
        {/* Lista de opciones de menú */}
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
              sx={{
                justifyContent: 'center', // Centra los íconos
                paddingY: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 'auto' }}>
                {item.icon}
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* Puedes añadir más elementos aquí si lo deseas */}
      </Drawer>
    </>
  );
}

export default Sidebar;