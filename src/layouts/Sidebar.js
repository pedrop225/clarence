import React from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  Tooltip,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 60; // Ancho fijo para los íconos

// Definición de los elementos del menú
const menuItems = [
  { icon: <HomeIcon />, path: '/', label: 'Inicio' },
  { icon: <BarChartIcon />, path: '/analysis', label: 'Análisis' },
  { icon: <PeopleIcon />, path: '/agentes-productivos', label: 'Agentes Productivos' },
  { icon: <SettingsIcon />, path: '/settings', label: 'Configuraciones' },
  // Añade más items según tus necesidades
];

// Estilizado personalizado del Drawer
const CustomDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth, // Ancho fijo
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: theme.transitions.create(['background-color'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: open ? theme.palette.background.paper : 'transparent', // Fondo transparente cuando está cerrado
    borderRight: 'none',
    overflowX: 'hidden',
    transition: theme.transitions.create(['background-color'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false); // Estado inicial: cerrado (oculto)

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <CustomDrawer variant="permanent" open={open}>
      {/* Contenedor para el botón de toggle siempre centrado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(1),
          height: '64px',
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          color="inherit"
          aria-label={open ? 'Cerrar barra lateral' : 'Abrir barra lateral'}
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Divider />
      {/* Lista de opciones de menú */}
      <List>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={item.label} placement="right" arrow>
            <ListItem
              button
              component={Link}
              to={item.path}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingY: 1.5,
                transition: theme.transitions.create(['opacity'], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
                opacity: open ? 1 : 0, // Suave animación de desvanecimiento
                pointerEvents: open ? 'auto' : 'none', // No permite clic cuando está oculto
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'primary.main',
                  minWidth: 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </CustomDrawer>
  );
}

export default Sidebar;