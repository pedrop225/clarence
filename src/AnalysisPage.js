import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Pagination,
  Modal,
  Button,
  IconButton,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Iconos para el botón de tema
import { useDataContext } from './DataContext'; // Importar el hook del contexto

function AnalysisPage() {
  const { agentNames } = useDataContext();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo noche

  const rowsPerPage = 10;

  // Lógica para alternar el tema claro y oscuro
  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    console.log('Nombres de Agentes:', agentNames);

    const agentsWithIds = agentNames.map((name, index) => ({
      id: index + 1,
      agentName: name,
      details: `Detalles del agente ${name}`,
    }));

    setRows(agentsWithIds);
    setFilteredRows(agentsWithIds);
  }, [agentNames]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = rows.filter((row) => row.agentName.toLowerCase().includes(query));
    setFilteredRows(filtered);
    setPage(1);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleOpenModal = (agent) => {
    setSelectedAgent(agent);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAgent(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        backgroundColor: darkMode ? '#121212' : 'rgba(255, 255, 255, 0.9)',
        color: darkMode ? '#fff' : '#000',
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Control de modo noche */}
      <IconButton
        onClick={handleThemeToggle}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: darkMode ? '#f1c40f' : '#673ab7',
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          color: darkMode ? '#f1c40f' : '#673ab7', // Ajustar el color según el tema
        }}
      >
        Análisis de Agentes
      </Typography>

      {/* Barra de búsqueda */}
      <TextField
        label="Buscar Agente"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        sx={{
          marginBottom: 3,
          width: '100%',
          maxWidth: 700,
          backgroundColor: darkMode ? '#333' : '#fff',
          borderRadius: '8px',
          input: { color: darkMode ? '#fff' : '#000' },
        }}
      />

      {/* Tabla de Agentes */}
      <Paper
        sx={{
          width: '100%',
          maxWidth: 700,
          boxShadow: darkMode ? '0 8px 30px rgba(255, 255, 255, 0.2)' : '0 8px 30px rgba(0, 0, 0, 0.2)',
          borderRadius: '15px',
          overflow: 'hidden',
          backgroundColor: darkMode ? '#333' : '#fff',
        }}
      >
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    backgroundColor: darkMode ? '#444' : '#f5f5f5',
                    color: darkMode ? '#fff' : '#000',
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    backgroundColor: darkMode ? '#444' : '#f5f5f5',
                    color: darkMode ? '#fff' : '#000',
                  }}
                >
                  Nombre del Agente
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          backgroundColor: darkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(94, 23, 235, 0.15)',
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => handleOpenModal(row)}
                    >
                      <TableCell sx={{ color: darkMode ? '#fff' : '#000' }}>
                        {(page - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? '#fff' : '#000' }}>{row.agentName}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ color: darkMode ? '#fff' : '#000' }}>
                    No se encontraron agentes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Paginación */}
      <Pagination
        count={Math.ceil(filteredRows.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{
          marginTop: 3,
          button: {
            color: darkMode ? '#fff' : '#000',
          },
        }}
      />

      {/* Modal para mostrar detalles del agente */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="agent-details-modal"
        aria-describedby="agent-details-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: darkMode ? '#333' : 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            color: darkMode ? '#fff' : '#000',
          }}
        >
          <Typography id="agent-details-modal" variant="h6" component="h2" gutterBottom>
            Detalles del Agente
          </Typography>
          {selectedAgent ? (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>Nombre:</strong> {selectedAgent.agentName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Detalles:</strong> {selectedAgent.details}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">No hay detalles disponibles.</Typography>
          )}
          <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 3 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default AnalysisPage;