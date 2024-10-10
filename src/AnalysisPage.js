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
  CircularProgress,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDataContext } from './DataContext';

function AnalysisPage() {
  const { agentData } = useDataContext();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const agentsWithIds = agentData.map((agent) => ({
      cod: agent.cod || 'N/A',
      agentName: agent.agentName || 'Sin nombre',
      details: `Detalles del agente ${agent.agentName}`,
    }));

    setRows(agentsWithIds);
    setFilteredRows(agentsWithIds);
    setLoading(false);
  }, [agentData]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = rows.filter(
      (row) =>
        row.agentName.toLowerCase().includes(query) || row.cod.toLowerCase().includes(query)
    );
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

  const handleSort = (column) => {
    const sortedRows = [...filteredRows].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setFilteredRows(sortedRows);
  };

  const cellStyle = (darkMode) => ({
    fontWeight: 'bold',
    fontSize: '16px',
    color: darkMode ? '#fff' : '#000',
    borderBottom: `1px solid ${darkMode ? '#555' : '#ddd'}`,
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 3,
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        transition: 'background-color 0.5s ease',
      }}
    >
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
          color: darkMode ? '#f1c40f' : '#673ab7',
        }}
      >
        Análisis de Agentes
      </Typography>

      <TextField
        label="Buscar Agente o Código"
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

      {loading ? (
        <CircularProgress sx={{ margin: '20px' }} />
      ) : (
        <Paper
          sx={{
            width: '100%',
            maxWidth: 800, // Ajuste del ancho máximo de la tabla
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
                      ...cellStyle(darkMode),
                      backgroundColor: darkMode ? '#444' : '#f5f5f5',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSort('cod')}
                  >
                    COD.
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyle(darkMode),
                      backgroundColor: darkMode ? '#444' : '#f5f5f5',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSort('agentName')}
                  >
                    Nombre del Agente
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.cod}
                        sx={{
                          transition: 'background-color 0.3s',
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(94, 23, 235, 0.15)',
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => handleOpenModal(row)}
                      >
                        <TableCell sx={{ color: darkMode ? '#fff' : '#000' }}>{row.cod}</TableCell>
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
      )}

      <Pagination
        count={Math.ceil(filteredRows.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{
          marginTop: 3,
          button: {
            color: darkMode ? '#fff' : '#000',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(94, 23, 235, 0.1)',
            },
          },
        }}
      />

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
            bgcolor: darkMode ? '#333' : '#fff',
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
                <strong>Código:</strong> {selectedAgent.cod}
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