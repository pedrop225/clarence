// src/pages/AnalysisPage.js
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
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
import {
  Brightness4,
  Brightness7,
  Info,
  BarChart as BarChartIcon,
  AssignmentInd,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDataContext } from '../context/DataContext';
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

// Tipos excluidos
const excludedTipos = [
  'AGENTE DE SEGUROS',
  'DERECHOS ECONOMICOS',
  'ADMINISTRADOR FINCAS',
];

// Función para aclarar colores
const lightenColor = (color, percent) => {
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
};

// Estilos personalizados
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

const StyledTableCell = styled(TableCell)({
  fontSize: '12px',
});

const StyledCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid #673ab7`,
  color: '#673ab7',
}));

const headCells = [
  { id: 'cod', label: 'CÓDIGO' },
  { id: 'agentName', label: 'NOMBRE DEL AGENTE' },
  { id: 'tipo', label: 'TIPO' },
  { id: 'inspector', label: 'INSPECTOR' },
  { id: 'mediaProductiva', label: 'M. PRODUCTIVA' },
];

// Componentes de sección del Modal
const GeneralInfo = ({ agent }) => (
  <StyledCard>
    <CardContent>
      <StyledCardTitle>
        <Info sx={{ marginRight: 1, color: '#673ab7' }} /> Información General
      </StyledCardTitle>
      <Typography variant="body1"><strong>Código:</strong> {agent.cod}</Typography>
      <Typography variant="body1"><strong>Nombre del Mediador:</strong> {agent.agentName}</Typography>
      <Typography variant="body1"><strong>Tipo de Mediador:</strong> {agent.tipo}</Typography>
      <Typography variant="body1"><strong>Inspector Asignado:</strong> {agent.inspector}</Typography>
    </CardContent>
  </StyledCard>
);

const Statistics = ({ agent }) => (
  <StyledCard>
    <CardContent>
      <StyledCardTitle>
        <AssignmentInd sx={{ marginRight: 1, color: '#673ab7' }} /> Estadísticas
      </StyledCardTitle>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Media Productiva:</strong> {agent.mediaProductiva}</Typography>
          <Typography variant="body1"><strong>Mediana:</strong> {agent.medianaProductiva}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Meses de análisis:</strong> {Object.keys(agent.tipoData).filter(
              (key) => {
                const value = parseFloat(agent.tipoData[key]);
                return ![0, 3, 12, 17].includes(value) && !isNaN(value);
              }
            ).length}
          </Typography>
          <Typography variant="body1">
            <strong>Total de pólizas:</strong> {Object.values(agent.polFisData).reduce(
              (sum, value) => (!isNaN(parseFloat(value)) ? sum + parseFloat(value) : sum), 0
            )}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </StyledCard>
);

const ProductionChart = ({ chartData, hoveredBarIndex, setHoveredBarIndex }) => (
  <StyledCard>
    <CardContent>
      <StyledCardTitle>
        <BarChartIcon sx={{ marginRight: 1, color: '#673ab7' }} /> Producción Mensual
      </StyledCardTitle>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            tickFormatter={(tick) => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][parseInt(tick, 10) - 1] || tick}
          />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }} />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            <LabelList dataKey="value" position="top" />
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredBarIndex === index ? lightenColor(entry.fillColor, 20) : entry.fillColor}
                cursor="pointer"
                onMouseEnter={() => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </StyledCard>
);

function AnalysisPage() {
  const { agentData } = useDataContext();
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ tipo: '', inspector: '' });
  const [sistematicaC, setSistematicaC] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [order, setOrder] = useState('asc'); // Orden ascendente por defecto
  const [orderBy, setOrderBy] = useState(''); // Columna de ordenamiento por defecto (vacía)
  const rowsPerPage = 15;
  const buttonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const theme = useMemo(() => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')), [darkMode]);

  // Función para calcular la media productiva
  const calculateMediaProductiva = (agent) => {
    if (!agent.tipoData || !agent.polFisData) return 'N/A';
    const mesesActivos = Object.values(agent.tipoData).filter(
      (value) => ![0, 3, 12, 17].includes(parseFloat(value)) && !isNaN(parseFloat(value))
    ).length;
    const totalPolizas = Object.values(agent.polFisData).reduce(
      (sum, value) => (!isNaN(parseFloat(value)) ? sum + parseFloat(value) : sum), 0
    );
    return mesesActivos > 0 ? (Math.round((totalPolizas / mesesActivos) * 100) / 100).toString() : 'N/A';
  };

  // Cargar datos de agentes
  useEffect(() => {
    const agentsWithIds = agentData.map((agent) => ({
      cod: agent.cod || 'N/A',
      agentName: agent.agentName || 'Sin nombre',
      tipo: agent.tipo || 'Desconocido',
      inspector: agent.inspector || 'Desconocido',
      mediaProductiva: calculateMediaProductiva(agent),
      polFisData: agent.polFisData || {},
      tipoData: agent.tipoData || {},
    }));
    setRows(agentsWithIds);
    setLoading(false);
  }, [agentData]);

  // Filtrar filas
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const queryMatch =
        row.agentName.toLowerCase().includes(searchQuery) ||
        row.cod.toLowerCase().includes(searchQuery);
      const tipoNormalized = row.tipo.trim().toUpperCase();
      const sistematicaMatch = sistematicaC ? true : !excludedTipos.includes(tipoNormalized);
      const tipoMatch = filters.tipo ? row.tipo === filters.tipo : true;
      const inspectorMatch = filters.inspector ? row.inspector === filters.inspector : true;
      return queryMatch && sistematicaMatch && tipoMatch && inspectorMatch;
    });
  }, [rows, searchQuery, filters, sistematicaC]);

  // Opciones de filtros
  const getFilterOptions = useCallback((key) => {
    return [...new Set(
      rows
        .filter((row) => {
          const queryMatch =
            row.agentName.toLowerCase().includes(searchQuery) ||
            row.cod.toLowerCase().includes(searchQuery);
          const tipoNormalized = row.tipo.trim().toUpperCase();
          const sistematicaMatch = sistematicaC ? true : !excludedTipos.includes(tipoNormalized);
          return queryMatch && sistematicaMatch;
        })
        .map((agent) => agent[key])
        .filter(Boolean)
    )];
  }, [rows, searchQuery, sistematicaC]);

  const tipoOptions = useMemo(() => getFilterOptions('tipo'), [getFilterOptions]);
  const inspectorOptions = useMemo(() => getFilterOptions('inspector'), [getFilterOptions]);

  // Generar datos para el gráfico
  const chartData = useMemo(() => {
    if (!selectedAgent) return [];
    const { polFisData, tipoData } = selectedAgent;
    const filteredEntries = Object.entries(polFisData).filter(
      ([key, value]) => {
        const tipoValue = parseFloat(tipoData[key]);
        const polizaValue = parseFloat(value);
        return ![0, 3, 12, 17].includes(tipoValue) && !isNaN(polizaValue);
      }
    );
    const values = filteredEntries.map(([_, value]) => parseFloat(value)).filter((v) => !isNaN(v));
    if (values.length === 0) return [];
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const mediana = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    selectedAgent.medianaProductiva = mediana.toString();

    return filteredEntries.map(([mes, value]) => ({
      mes: mes.split('-')[1],
      value: Number(value),
      fillColor:
        Number(value) < 0
          ? '#e74c3c'
          : Number(value) === Math.max(...values)
          ? '#2ecc71'
          : Number(value) < mediana
          ? '#e67e22'
          : '#8884d8',
    }));
  }, [selectedAgent]);

  // Funciones de ordenamiento
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] === undefined || b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (a[orderBy] === undefined || b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderComp = comparator(a[0], b[0]);
      if (orderComp !== 0) return orderComp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Manejar ordenamiento al hacer clic en cabecera
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Manejar exportación a PDF
  useEffect(() => {
    const exportToPdf = async () => {
      if (exporting && modalRef.current) {
        // Ocultar los botones para que no aparezcan en el PDF
        if (buttonRef.current) buttonRef.current.style.display = 'none';
        if (closeButtonRef.current) closeButtonRef.current.style.display = 'none';

        // Ajustar estilos para exportación
        modalRef.current.style.maxHeight = 'none';
        modalRef.current.style.transform = 'scale(1)';
        modalRef.current.style.overflow = 'visible';

        // Esperar a que los estilos se apliquen
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Capturar y generar PDF
        const canvas = await html2canvas(modalRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 12;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        window.open(pdf.output('bloburl'));

        // Restaurar estilos y visibilidad de botones
        modalRef.current.style.maxHeight = '80vh';
        modalRef.current.style.transform = `scale(1)`;
        modalRef.current.style.overflowY = 'auto';
        if (buttonRef.current) buttonRef.current.style.display = 'block';
        if (closeButtonRef.current) closeButtonRef.current.style.display = 'block';
        setExporting(false);
      }
    };
    if (exporting) exportToPdf();
  }, [exporting]);

  const handleExportToPdf = () => setExporting(true);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          padding: 3,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: 'background-color 0.5s ease',
          position: 'relative',
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
            {/* Botón de cambio de tema */}
            <IconButton
              onClick={() => setDarkMode((prev) => !prev)}
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

            {/* Título */}
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

            {/* Filtros de búsqueda y selección */}
            <Grid container spacing={2} sx={{ maxWidth: 1000, margin: '0 auto', marginBottom: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Buscar Agente o Código"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value.toLowerCase()); setPage(1); }}
                  size="small"
                  fullWidth
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 12 } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: 12 }}>Tipo</InputLabel>
                  <Select
                    label="Tipo"
                    name="tipo"
                    value={filters.tipo}
                    onChange={(e) => { setFilters((prev) => ({ ...prev, tipo: e.target.value })); setPage(1); }}
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {tipoOptions.map((tipo) => (
                      <MenuItem key={tipo} value={tipo} sx={{ fontSize: 12 }}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: 12 }}>Inspector</InputLabel>
                  <Select
                    label="Inspector"
                    name="inspector"
                    value={filters.inspector}
                    onChange={(e) => { setFilters((prev) => ({ ...prev, inspector: e.target.value })); setPage(1); }}
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {inspectorOptions.map((inspector) => (
                      <MenuItem key={inspector} value={inspector} sx={{ fontSize: 12 }}>
                        {inspector}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Tabla de Agentes */}
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
                            color: theme.palette.mode === 'dark' ? '#888' : 'inherit',
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
                        <StyledTableRow key={row.cod} onClick={() => { setSelectedAgent(row); setOpenModal(true); }}>
                          <StyledTableCell>{row.cod}</StyledTableCell>
                          <StyledTableCell>{row.agentName}</StyledTableCell>
                          <StyledTableCell>{row.tipo}</StyledTableCell>
                          <StyledTableCell>{row.inspector}</StyledTableCell>
                          <StyledTableCell sx={row.mediaProductiva !== 'N/A' && Number(row.mediaProductiva) < 3 ? { color: 'red', fontWeight: 'bold' } : {}}>
                            {row.mediaProductiva}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    {filteredRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No se encontraron agentes.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Barra de filtros y conteo */}
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
                      onChange={(e) => { setSistematicaC(e.target.checked); setFilters({ tipo: '', inspector: '' }); setPage(1); }}
                      color="primary"
                    />
                  }
                  label="Mostrar todos."
                  sx={{
                    fontSize: 12,
                    '& .MuiTypography-root': { fontSize: 12 },
                  }}
                />
                <Typography sx={{ fontSize: 12 }}>{filteredRows.length} registros encontrados</Typography>
              </Box>

              {/* Paginación */}
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
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Paper>

            {/* Modal de detalles del agente */}
            <Modal
              open={openModal}
              onClose={() => { setOpenModal(false); setSelectedAgent(null); }}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
                sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
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
                    maxHeight: '80vh',
                  }}
                >
                  {selectedAgent && (
                    <>
                      <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 700, fontSize: '24px', color: '#673ab7', marginBottom: '20px' }}
                      >
                        Detalles del Mediador
                      </Typography>

                      <GeneralInfo agent={selectedAgent} />
                      <Statistics agent={selectedAgent} />
                      <ProductionChart
                        chartData={chartData}
                        hoveredBarIndex={hoveredBarIndex}
                        setHoveredBarIndex={setHoveredBarIndex}
                      />

                      {/* Botones de impresión y cierre */}
                      <IconButton
                        ref={buttonRef}
                        onClick={handleExportToPdf}
                        sx={{ position: 'absolute', top: 8, right: 48 }}
                      >
                        <PrintIcon />
                      </IconButton>
                      <IconButton
                        ref={closeButtonRef}
                        onClick={() => { setOpenModal(false); setSelectedAgent(null); }}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
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