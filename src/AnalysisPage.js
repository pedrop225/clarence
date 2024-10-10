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
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDataContext } from './DataContext';

function AnalysisPage() {
  const { agentData } = useDataContext(); // Datos de los agentes
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true); // Para indicación de carga
  const [filters, setFilters] = useState({
    tipo: '', // Filtro personalizado para "TIPO"
    inspNombre: '', // Filtro personalizado para "INSP. NOMBRE"
  });

  const rowsPerPage = 10;

  // Tema oscuro/claro
  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      const agentsWithIds = agentData.map((agent) => ({
        cod: agent.cod || 'N/A',
        agentName: agent.agentName || 'Sin nombre',
        tipo: agent.tipo || 'Desconocido', // Columna "TIPO"
        inspNombre: agent.inspNombre || 'Desconocido', // Columna "INSP. NOMBRE"
        details: `Detalles del agente ${agent.agentName}`,
      }));

      setRows(agentsWithIds);
      setFilteredRows(agentsWithIds);
      setLoading(false); // Fin de la carga
    }, 1500);
  }, [agentData]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, filters);
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

  // Aplicar filtros avanzados y búsqueda
  const applyFilters = (query, filters) => {
    const filtered = rows.filter((row) => {
      const matchesQuery = row.agentName.toLowerCase().includes(query) || row.cod.toLowerCase().includes(query);
      const matchesTipo = filters.tipo ? row.tipo === filters.tipo : true;
      const matchesInspNombre = filters.inspNombre ? row.inspNombre === filters.inspNombre : true;
      return matchesQuery && matchesTipo && matchesInspNombre;
    });
    setFilteredRows(filtered);
    setPage(1);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    applyFilters(searchQuery, { ...filters, [name]: value });
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
        backgroundColor: darkMode ? '#181818' : '#f9f9f9', // Fondo más oscuro
        color: darkMode ? '#e0e0e0' : '#000', // Texto gris claro para modo oscuro
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Indicador de carga */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {!loading && (
        <>
          {/* Tema */}
          <IconButton
            onClick={handleThemeToggle}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: darkMode ? '#f1c40f' : '#673ab7', // Amarillo para modo oscuro, púrpura para claro
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
              color: darkMode ? '#f1c40f' : '#673ab7', // Amarillo suave en modo oscuro
            }}
          >
            Análisis de Agentes
          </Typography>

          {/* Filtros avanzados */}
          <Grid container spacing={2} sx={{ maxWidth: 800, marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Buscar Agente o Código"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  width: '100%',
                  backgroundColor: darkMode ? '#333' : '#fff', // Fondo oscuro para input
                  input: { color: darkMode ? '#e0e0e0' : '#000' }, // Texto gris claro en modo oscuro
                }}
              />
            </Grid>
            {/* Filtro personalizado para 'TIPO' */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>Tipo</InputLabel>
                <Select
                  label="Tipo"
                  name="tipo"
                  value={filters.tipo}
                  onChange={handleFilterChange}
                  sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Tipo A">Tipo A</MenuItem>
                  <MenuItem value="Tipo B">Tipo B</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Filtro personalizado para 'INSP. NOMBRE' */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>Insp. Nombre</InputLabel>
                <Select
                  label="Insp. Nombre"
                  name="inspNombre"
                  value={filters.inspNombre}
                  onChange={handleFilterChange}
                  sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Inspector 1">Inspector 1</MenuItem>
                  <MenuItem value="Inspector 2">Inspector 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Tabla de Agentes */}
          <Paper
            sx={{
              width: '100%',
              maxWidth: 800,
              boxShadow: darkMode ? '0 8px 30px rgba(255, 255, 255, 0.1)' : '0 8px 30px rgba(0, 0, 0, 0.2)', // Suave en oscuro
              borderRadius: '15px',
              overflow: 'hidden',
              backgroundColor: darkMode ? '#252525' : '#fff', // Fondo de la tabla más oscuro
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
                        backgroundColor: darkMode ? '#333' : '#f5f5f5',
                        color: darkMode ? '#e0e0e0' : '#000', // Texto claro en oscuro
                      }}
                    >
                      Código
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        backgroundColor: darkMode ? '#333' : '#f5f5f5',
                        color: darkMode ? '#e0e0e0' : '#000',
                      }}
                    >
                      Nombre del Agente
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        backgroundColor: darkMode ? '#333' : '#f5f5f5',
                        color: darkMode ? '#e0e0e0' : '#000',
                      }}
                    >
                      Tipo
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        backgroundColor: darkMode ? '#333' : '#f5f5f5',
                        color: darkMode ? '#e0e0e0' : '#000',
                      }}
                    >
                      Insp. Nombre
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
                            '&:hover': {
                              backgroundColor: darkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(94, 23, 235, 0.15)', // Hover suave
                            },
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpenModal(row)}
                        >
                          <TableCell sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>{row.cod}</TableCell>
                          <TableCell sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>{row.agentName}</TableCell>
                          <TableCell sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>{row.tipo}</TableCell>
                          <TableCell sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>{row.inspNombre}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ color: darkMode ? '#e0e0e0' : '#000' }}>
                        No se encontraron agentes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
              <Pagination
                count={Math.ceil(filteredRows.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          </Paper>

          {/* Modal de Detalles del Agente */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                backgroundColor: darkMode ? '#333' : '#fff',
                color: darkMode ? '#fff' : '#000',
                padding: 4,
                maxWidth: 600,
                margin: 'auto',
                marginTop: '20vh',
                borderRadius: '10px',
                boxShadow: darkMode ? '0 4px 12px rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              {selectedAgent && (
                <>
                  <Typography variant="h6">{selectedAgent.agentName}</Typography>
                  <Typography variant="body1">Código: {selectedAgent.cod}</Typography>
                  <Typography variant="body2">Tipo: {selectedAgent.tipo}</Typography>
                  <Typography variant="body2">Insp. Nombre: {selectedAgent.inspNombre}</Typography>
                  <Typography variant="body2">{selectedAgent.details}</Typography>
                  <Button
                    variant="contained"
                    onClick={handleCloseModal}
                    sx={{ marginTop: 2, backgroundColor: darkMode ? '#f1c40f' : '#673ab7' }}
                  >
                    Cerrar
                  </Button>
                </>
              )}
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
}

export default AnalysisPage;