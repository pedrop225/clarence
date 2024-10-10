import React, { useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDataContext } from './DataContext'; // Importar el hook del contexto

function AnalysisPage() {
  const { agentNames } = useDataContext(); // Usar el hook para acceder al contexto

  // Enviar los nombres de los agentes a la consola
  useEffect(() => {
    console.log('Nombres de Agentes:', agentNames); // Esto enviará la información a la consola
  }, [agentNames]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
        Análisis de Agentes
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 800, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)', borderRadius: '15px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre del Agente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agentNames.length > 0 ? (
              agentNames.map((name, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No se encontraron agentes.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AnalysisPage;