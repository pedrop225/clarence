import React, { useEffect, useState, useMemo, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
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
  Switch,
  FormControlLabel,
  Backdrop,
  Fade,
  TableSortLabel,
  Card,
  CardContent,
} from '@mui/material';
import { Brightness4, Brightness7, Info, BarChart as BarChartIcon, AssignmentInd } from '@mui/icons-material'; // Nuevos íconos importados
import { jsPDF } from 'jspdf';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDataContext } from './DataContext';
import { styled } from '@mui/system';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';
import html2canvas from 'html2canvas';

// Configuración del tema (light y dark mode)
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#673ab7' },
          background: { default: '#f9f9f9', paper: '#fff' },
        }
      : {
          primary: { main: '#f1c40f' },
          background: { default: '#181818', paper: '#252525' },
        }),
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const excludedTipos = [
  'AGENTE DE SEGUROS',
  'DERECHOS ECONOMICOS',
  'ADMINISTRADOR FINCAS',
];

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[5],
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.3s ease',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '12px',
}));

const StyledCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid #673ab7`, // Fijar color de borde
  color: '#673ab7', // Fijar color del texto del título
}));

const StyledCardIcon = {
  color: '#673ab7', // Fijar color del icono
};

const headCells = [
  { id: 'cod', label: 'CÓDIGO' },
  { id: 'agentName', label: 'NOMBRE DEL AGENTE' },
  { id: 'tipo', label: 'TIPO' },
  { id: 'inspector', label: 'INSPECTOR' },
  { id: 'mediaProductiva', label: 'M. PRODUCTIVA' },
];

function AnalysisPage() {
  const { agentData } = useDataContext();
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipo: '',
    inspector: '',
  });
  const [sistematicaC, setSistematicaC] = useState(false);
  const rowsPerPage = 15;
  const buttonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  const theme = useMemo(
    () => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')),
    [darkMode]
  );

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const calculateMediaProductiva = (agent) => {
    if (!agent.tipoData || !agent.polFisData) {
      return 'N/A';
    }

    const mesesActivos = Object.keys(agent.tipoData).filter((key) => {
      const value = parseFloat(agent.tipoData[key]);
      return (
        value !== 3 &&
        value !== 12 &&
        value !== 17 &&
        value !== 0 &&
        !isNaN(value)
      );
    }).length;

    const totalPolizas = Object.values(agent.polFisData).reduce((sum, value) => {
      const numValue = parseFloat(value);
      return !isNaN(numValue) ? sum + numValue : sum;
    }, 0);

    return mesesActivos > 0
      ? Math.round((totalPolizas / mesesActivos) * 100) / 100
      : 'N/A';
  };

  useEffect(() => {
    setTimeout(() => {
      const agentsWithIds = agentData.map((agent) => ({
        cod: agent.cod || 'N/A',
        agentName: agent.agentName || 'Sin nombre',
        tipo: agent.tipo || 'Desconocido',
        inspector: agent.inspector || 'Desconocido',
        codTipo: agent.tipoData ? agent.tipoData['CÓD. TIPO'] : 'N/A',
        mediaProductiva: calculateMediaProductiva(agent),
        details: `Detalles del agente ${agent.agentName}`,
        polFisData: agent.polFisData || {},
        tipoData: agent.tipoData || {},
      }));

      setRows(agentsWithIds);
      setLoading(false);
    }, 1500);
  }, [agentData]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSistematicaChange = (event) => {
    setSistematicaC(event.target.checked);
    setFilters({ tipo: '', inspector: '' });
    setPage(1);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        row.agentName.toLowerCase().includes(searchQuery) ||
        row.cod.toLowerCase().includes(searchQuery);

      const tipoNormalized = row.tipo ? row.tipo.trim().toUpperCase() : '';

      const matchesSistematicaC = !sistematicaC
        ? !excludedTipos.includes(tipoNormalized)
        : true;

      const matchesTipo = filters.tipo ? row.tipo === filters.tipo : true;
      const matchesInspector = filters.inspector
        ? row.inspector === filters.inspector
        : true;

      return matchesQuery && matchesSistematicaC && matchesTipo && matchesInspector;
    });
  }, [rows, searchQuery, filters, sistematicaC]);

  const tipoOptions = useMemo(() => {
    const tipos = [
      ...new Set(
        rows
          .filter((row) => {
            const matchesQuery =
              row.agentName.toLowerCase().includes(searchQuery) ||
              row.cod.toLowerCase().includes(searchQuery);

            const tipoNormalized = row.tipo ? row.tipo.trim().toUpperCase() : '';

            const matchesSistematicaC = !sistematicaC
              ? !excludedTipos.includes(tipoNormalized)
              : true;

            return matchesQuery && matchesSistematicaC;
          })
          .map((agent) => agent.tipo)
          .filter(Boolean)
      ),
    ];
    return tipos;
  }, [rows, searchQuery, sistematicaC]);

  const inspectorOptions = useMemo(() => {
    const inspectores = [
      ...new Set(
        rows
          .filter((row) => {
            const matchesQuery =
              row.agentName.toLowerCase().includes(searchQuery) ||
              row.cod.toLowerCase().includes(searchQuery);

            const tipoNormalized = row.tipo ? row.tipo.trim().toUpperCase() : '';

            const matchesSistematicaC = !sistematicaC
              ? !excludedTipos.includes(tipoNormalized)
              : true;

            return matchesQuery && matchesSistematicaC;
          })
          .map((agent) => agent.inspector)
          .filter(Boolean)
      ),
    ];
    return inspectores;
  }, [rows, searchQuery, sistematicaC]);

  const handleExportToPdf = async () => {
    buttonRef.current.style.display = 'none';
    closeButtonRef.current.style.display = 'none';

    const canvas = await html2canvas(modalRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    const margin = 12;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

    // Abre el PDF en una nueva pestaña
    window.open(pdf.output('bloburl'));

    buttonRef.current.style.display = 'block';
    closeButtonRef.current.style.display = 'block';
  };

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] === undefined || b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (a[orderBy] === undefined || b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderComp = comparator(a[0], b[0]);
      if (orderComp !== 0) return orderComp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const chartData = useMemo(() => {
    if (!selectedAgent || !selectedAgent.polFisData || !selectedAgent.tipoData) return [];

    // Filtrar los valores de polFisData cuyos índices en tipoData no tienen 0, 3, 12, o 17,
    // y asegurarnos de que el valor de polFisData sea numérico y no sea una cadena vacía ('')
    const filteredValues = Object.keys(selectedAgent.polFisData)
      .filter((key) => {
        const tipoValue = parseFloat(selectedAgent.tipoData[key]);
        const polizaValue = selectedAgent.polFisData[key];

        // Verificar que el valor en tipoData no sea 0, 3, 12 o 17, y que el valor de polFisData sea numérico y no vacío
        return tipoValue !== 0 && tipoValue !== 3 && tipoValue !== 12 && tipoValue !== 17 && !isNaN(polizaValue) && polizaValue !== '';
      })
      .map((key) => parseFloat(selectedAgent.polFisData[key])) // Convertir a número
      .filter((v) => !isNaN(v)); // Filtrar solo valores numéricos válidos

    // Verificar si hay valores filtrados
    if (filteredValues.length === 0) {
      selectedAgent.medianaProductiva = 'N/A'; // No hay datos suficientes
      return [];
    }

    // Ordenar los valores para el cálculo de la mediana
    filteredValues.sort((a, b) => a - b);

    const mid = Math.floor(filteredValues.length / 2);

    // Calcular la mediana
    const mediana =
      filteredValues.length % 2 !== 0
        ? filteredValues[mid] // Si el número es impar, devolver el valor del medio
        : (filteredValues[mid - 1] + filteredValues[mid]) / 2; // Si es par, devolver el promedio

    selectedAgent.medianaProductiva = mediana; // Guardamos la mediana en el objeto del agente

    // Generar datos del gráfico
    return Object.entries(selectedAgent.polFisData).map(([mes, value]) => ({
      mes: mes.split('-')[1], // Obtener el mes
      value: Number(value),
      fillColor:
        Number(value) < 0
          ? '#e74c3c' // Valores negativos en rojo
          : Number(value) === Math.max(...filteredValues)
          ? '#2ecc71' // Máximo valor en verde
          : Number(value) < mediana
          ? '#e67e22' // Inferior a la mediana en naranja
          : '#8884d8', // Otros en color estándar
    }));
  }, [selectedAgent]);

  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          padding: 3,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: 'background-color 0.5s ease',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <IconButton
              onClick={handleThemeToggle}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                color: theme.palette.primary.main,
                transition: 'color 0.3s ease',
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <Typography
              variant="h4"
              sx={{
                marginBottom: 3,
                fontWeight: 600,
                color: theme.palette.primary.main,
                textAlign: 'center',
              }}
            >
              Análisis de Agentes
            </Typography>

            {/* Filtros */}
            <Grid
              container
              spacing={2}
              sx={{ maxWidth: 1000, margin: '0 auto', marginBottom: 2 }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Buscar Agente o Código"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearch}
                  sx={{
                    width: '100%',
                    fontSize: '12px',
                  }}
                  InputProps={{
                    style: { fontSize: '12px' },
                  }}
                  InputLabelProps={{
                    style: { fontSize: '12px' },
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '12px' }}>Tipo</InputLabel>
                  <Select
                    label="Tipo"
                    name="tipo"
                    value={filters.tipo}
                    onChange={handleFilterChange}
                    sx={{ fontSize: '12px' }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {tipoOptions.map((tipo) => (
                      <MenuItem key={tipo} value={tipo} sx={{ fontSize: '12px' }}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '12px' }}>Inspector</InputLabel>
                  <Select
                    label="Inspector"
                    name="inspector"
                    value={filters.inspector}
                    onChange={handleFilterChange}
                    sx={{ fontSize: '12px' }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {inspectorOptions.map((inspector) => (
                      <MenuItem key={inspector} value={inspector} sx={{ fontSize: '12px' }}>
                        {inspector}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Tabla */}
            <Paper
              sx={{
                width: '100%',
                maxWidth: 1000,
                margin: '0 auto',
                boxShadow: theme.shadows[3],
                borderRadius: '15px',
                overflow: 'hidden',
              }}
            >
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          sortDirection={orderBy === headCell.id ? order : false}
                          sx={{
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '12px',
                            backgroundColor: theme.palette.background.paper,
                            color:
                              theme.palette.mode === 'dark' ? '#888' : 'inherit',
                          }}
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => handleRequestSort(headCell.id)}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stableSort(filteredRows, getComparator(order, orderBy))
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((row) => (
                        <StyledTableRow key={row.cod} onClick={() => handleOpenModal(row)}>
                          <StyledTableCell>{row.cod}</StyledTableCell>
                          <StyledTableCell>{row.agentName}</StyledTableCell>
                          <StyledTableCell>{row.tipo}</StyledTableCell>
                          <StyledTableCell>{row.inspector}</StyledTableCell>
                          <StyledTableCell
                            sx={
                              row.mediaProductiva !== 'N/A' && Number(row.mediaProductiva) < 3
                                ? { color: 'red', fontWeight: 'bold' }
                                : {}
                            }
                          >
                            {row.mediaProductiva}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    {filteredRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No se encontraron agentes.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 1,
                  fontSize: '12px',
                  color: theme.palette.text.secondary,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={sistematicaC}
                      onChange={handleSistematicaChange}
                      color="primary"
                    />
                  }
                  label="Mostrar todos."
                  sx={{
                    fontSize: '12px',
                    marginLeft: 0,
                    '& .MuiTypography-root': {
                      fontSize: '12px',
                    },
                  }}
                />

                <Typography sx={{ fontSize: '12px' }}>
                  {filteredRows.length} registros encontrados
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 2,
                }}
              >
                <Pagination
                  count={Math.ceil(filteredRows.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Paper>

            {/* Modal de Detalles del Agente */}
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
                sx: {
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <Fade in={openModal}>
                <Box
                  ref={modalRef}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    width: '90%',
                    maxWidth: '800px',
                    margin: '30px auto',
                    padding: 4,
                    borderRadius: '10px',
                    boxShadow: 3,
                    position: 'relative',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 60px)',
                  }}
                >
                  {selectedAgent && (
                    <>
                      <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{
                          fontWeight: 700, // Aumentar peso de la fuente
                          fontSize: '24px', // Aumentar tamaño de la fuente
                          color: '#673ab7', // Aplicar el color solicitado
                          marginBottom: '20px', // Añadir espacio debajo del título
                        }}
                      >
                        Detalles del Mediador
                      </Typography>

                      {/* Tarjeta 1: Datos del Agente */}
                      <StyledCard>
                        <CardContent>
                          <StyledCardTitle>
                            <Info sx={{ marginRight: 1, ...StyledCardIcon }} /> Información General
                          </StyledCardTitle>
                          <Typography variant="body1">
                            <strong>Código:</strong> {selectedAgent.cod}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Nombre del Mediador:</strong> {selectedAgent.agentName}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Tipo de Mediador:</strong> {selectedAgent.tipo}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Inspector Asignado:</strong> {selectedAgent.inspector}
                          </Typography>
                        </CardContent>
                      </StyledCard>

                      {/* Tarjeta 2: Estadísticas */}
                      <StyledCard>
                        <CardContent>
                          <StyledCardTitle>
                            <AssignmentInd sx={{ marginRight: 1, ...StyledCardIcon }} /> Estadísticas
                          </StyledCardTitle>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              {/* Primera columna de estadísticas */}
                              <Typography variant="body1">
                                <strong>Media Productiva:</strong> {selectedAgent.mediaProductiva}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Mediana:</strong> {selectedAgent.medianaProductiva}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {/* Segunda columna de estadísticas */}
                              <Typography variant="body1">
                                <strong>Meses de análisis:</strong> {Object.keys(selectedAgent.tipoData).filter((key) => {
                                  const value = parseFloat(selectedAgent.tipoData[key]);
                                  return value !== 0 && value !== 3 && value !== 12 && value !== 17 && !isNaN(value);
                                }).length}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Total de pólizas:</strong> {Object.values(selectedAgent.polFisData).reduce((sum, value) => {
                                  const numValue = parseFloat(value);
                                  return !isNaN(numValue) ? sum + numValue : sum;
                                }, 0)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>

                      {/* Tarjeta 3: Gráficos */}
                      <StyledCard>
                        <CardContent>
                          <StyledCardTitle>
                            <BarChartIcon sx={{ marginRight: 1, ...StyledCardIcon }} /> Producción Mensual
                          </StyledCardTitle>
                          <div id="chartContainer">
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="mes"
                                  tickFormatter={(tick) => {
                                    const meses = [
                                      'Ene',
                                      'Feb',
                                      'Mar',
                                      'Abr',
                                      'May',
                                      'Jun',
                                      'Jul',
                                      'Ago',
                                      'Sep',
                                      'Oct',
                                      'Nov',
                                      'Dic',
                                    ];
                                    return meses[parseInt(tick, 10) - 1] || tick;
                                  }}
                                />
                                <YAxis />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                  }}
                                />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                  <LabelList dataKey="value" position="top" />
                                  {chartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        hoveredBarIndex === index
                                          ? lightenColor(entry.fillColor, 20)
                                          : entry.fillColor
                                      }
                                      cursor="pointer"
                                      onMouseEnter={() => setHoveredBarIndex(index)}
                                      onMouseLeave={() => setHoveredBarIndex(null)}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </StyledCard>

                      <Box sx={{ textAlign: 'center', marginTop: 4, marginBottom: 4 }}>
                        <Button
                          ref={buttonRef}
                          variant="contained"
                          color="primary"
                          onClick={handleExportToPdf}
                        >
                          Exportar como PDF
                        </Button>
                      </Box>
                    </>
                  )}
                <IconButton
                  ref={closeButtonRef}
                  onClick={handleCloseModal}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <CloseIcon />
                </IconButton>
                </Box>
              </Fade>
            </Modal>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default AnalysisPage;