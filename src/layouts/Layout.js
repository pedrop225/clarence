// src/layouts/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

function Layout() {
  return (
    <>
      <Sidebar />
      <Box sx={{ padding: 3, marginLeft: { sm: 0 }, transition: 'margin-left 0.3s ease' }}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;