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
  Typography,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Análisis', icon: <BarChartIcon />, path: '/analysis' },
    { text: 'Agentes Productivos', icon: <PeopleIcon />, path: '/agentes-productivos' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
    // Añade más items según tus necesidades
  ];

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

      {/* Drawer: Barra lateral */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: '#333',
          },
        }}
      >
        {/* Encabezado de la barra lateral con botón de cerrar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" noWrap>
            Navegación
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Lista de opciones de menú */}
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              onClick={toggleDrawer(false)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {/* Opciones adicionales o sección de usuario */}
        <Box sx={{ flexGrow: 1 }} />
        {/* Puedes añadir más elementos aquí si lo deseas */}
      </Drawer>
    </>
  );
}

export default Sidebar;