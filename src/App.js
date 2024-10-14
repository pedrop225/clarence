// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Cambio a HashRouter
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import AgentesProductivos from './pages/AgentesProductivos';
import Layout from './layouts/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './transitions.css';

function App() {
  const theme = createTheme({
    // Configuración personalizada del tema
    palette: {
      primary: {
        main: '#673ab7', // Morado
      },
      secondary: {
        main: '#f1c40f', // Amarillo
      },
      background: {
        default: '#f9f9f9',
        paper: '#fff',
      },
      text: {
        primary: '#000',
        secondary: '#555',
      },
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Ruta sin Layout (HomePage) */}
          <Route path="/" element={<HomePage />} />

          {/* Rutas con Layout (incluyen Sidebar) */}
          <Route element={<Layout />}>
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/agentes-productivos" element={<AgentesProductivos />} />
            {/* Añade más rutas aquí si es necesario */}
          </Route>

          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Componente para páginas no encontradas
const NotFound = () => (
  <Box sx={{ textAlign: 'center', marginTop: 5 }}>
    <Typography variant="h4">404 - Página No Encontrada</Typography>
  </Box>
);

export default App;