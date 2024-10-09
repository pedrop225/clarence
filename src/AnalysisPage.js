import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { DataContext } from './DataContext';
import { useNavigate } from 'react-router-dom';

function AnalysisPage() {
  const { data } = useContext(DataContext); // Accede a los datos cargados
  const [names, setNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data.length === 0) {
      // Si no hay datos, redirigir a la página de inicio
      navigate('/');
    } else {
      // Extrae la columna 'Nombre' de los datos cargados
      const namesList = data.map((row) => row['Nombre']);
      setNames(namesList);
    }
  }, [data, navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Nombres
      </Typography>
      <List>
        {names.map((name, index) => (
          <ListItem key={index}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AnalysisPage;