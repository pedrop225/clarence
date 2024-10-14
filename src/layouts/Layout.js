// src/layouts/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ruta relativa corregida
import Box from '@mui/material/Box';

function Layout() {
  return (
    <>
      <Sidebar />
      <Box sx={{ marginLeft: { sm: 0 }, padding: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;