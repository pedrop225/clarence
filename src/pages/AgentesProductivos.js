// src/pages/AgentesProductivos.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDataContext } from '../context/DataContext';
import { format, parseISO } from 'date-fns';

function AgentesProductivos() {
  const { agents, loading, error } = useDataContext();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [productivos, setProductivos] = useState([]);

  // Depuración: Log de agentes al cargar
  useEffect(() => {
    console.log('Agentes cargados:', agents);
  }, [agents]);

  // Extraer meses disponibles de los agentes
  useEffect(() => {
    if (!agents || !Array.isArray(agents)) {
      console.error('Agentes no están definidos o no son un array.');
      return;
    }

    const monthsSet = new Set();
    agents.forEach((agent) => {
      if (agent.polFisData && typeof agent.polFisData === 'object') {
        Object.keys(agent.polFisData).forEach((month) => {
          monthsSet.add(month);
        });
      } else {
        console.warn(`Agente con cod ${agent.cod} no tiene polFisData definida.`);
      }
    });

    const monthsArray = Array.from(monthsSet).sort();
    setAvailableMonths(monthsArray);
    console.log('Meses Disponibles:', monthsArray);
  }, [agents]);

  // Manejar cambio de mes seleccionado
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Filtrar agentes productivos según el mes seleccionado
  useEffect(() => {
    if (!selectedMonth) {
      setProductivos([]);
      return;
    }

    const productivosList = agents.filter(
      (agent) =>
        agent.tipo !== '' &&
        agent.tipo !== 3 &&
        agent.tipo !== 12 &&
        agent.tipo !== 17 &&
        agent.polFisData &&
        typeof agent.polFisData[selectedMonth] === 'number' &&
        agent.polFisData[selectedMonth] > 0
    );

    setProductivos(productivosList);
    console.log(`Agentes productivos para ${selectedMonth}:`, productivosList);
  }, [selectedMonth, agents]);

  // Generar opciones para el dropdown
  const renderMonthOptions = () =>
    availableMonths.map((month) => {
      try {
        const date = parseISO(`${month}-01`);
        const monthName = format(date, 'MMM'); // Ejemplo: 'Mar'
        const yearMonth = format(date, 'yyyy-MM'); // '2024-03'
        return (
          <MenuItem key={month} value={month}>
            {`${monthName} (${yearMonth})`}
          </MenuItem>
        );
      } catch (error) {
        console.error(`Error al formatear el mes ${month}:`, error);
        return null;
      }
    });

  // Formatear el nombre completo del mes para la tabla
  const getMonthFullName = (month) => {
    try {
      const date = parseISO(`${month}-01`);
      return format(date, 'MMMM yyyy'); // Ejemplo: 'Marzo 2024'
    } catch (error) {
      console.error(`Error al formatear el nombre del mes ${month}:`, error);
      return month;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agentes Productivos
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Dropdown para seleccionar el mes */}
          <FormControl sx={{ minWidth: 200, marginBottom: 4 }}>
            <InputLabel id="select-month-label">Selecciona un Mes</InputLabel>
            <Select
              labelId="select-month-label"
              id="select-month"
              value={selectedMonth}
              label="Selecciona un Mes"
              onChange={handleMonthChange}
            >
              {renderMonthOptions()}
            </Select>
          </FormControl>

          {/* Mostrar mensaje si no hay agentes productivos */}
          {selectedMonth && productivos.length === 0 && (
            <Alert severity="info">
              No hay agentes productivos para el mes {getMonthFullName(selectedMonth)}.
            </Alert>
          )}

          {/* Tabla de Agentes Productivos */}
          {selectedMonth && productivos.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Agentes Productivos - {getMonthFullName(selectedMonth)}
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="tabla de agentes productivos">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Inspector</TableCell>
                      <TableCell>POL FIS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productivos.map((agent) => (
                      <TableRow key={agent.cod}>
                        <TableCell>{agent.cod}</TableCell>
                        <TableCell>{agent.agentName}</TableCell>
                        <TableCell>
                          {agent.tipoData && agent.tipoData.descripcion
                            ? agent.tipoData.descripcion
                            : agent.tipo}
                        </TableCell>
                        <TableCell>{agent.inspector}</TableCell>
                        <TableCell>{agent.polFisData[selectedMonth]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default AgentesProductivos;