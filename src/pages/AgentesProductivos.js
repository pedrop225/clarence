// src/pages/AgentesProductivos.js
import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';

function AgentesProductivos() {
  return (
    <Box
      sx={{
        padding: 3,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Agentes Productivos
      </Typography>
      <Paper sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Información de Agentes</Typography>
            {/* Añade aquí la información detallada de los agentes productivos */}
            <Typography variant="body1">
              Aquí puedes agregar la información relacionada con los Agentes Productivos.
            </Typography>
          </Grid>
          {/* Añade más secciones según sea necesario */}
        </Grid>
      </Paper>
    </Box>
  );
}

export default AgentesProductivos;