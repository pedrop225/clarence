import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Asegúrate de que esta línea esté presente
import { Box, Button, Card, CardContent, Typography, Grid, CircularProgress, Snackbar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { motion } from 'framer-motion'; 
import BackgroundImage from './background.jpeg';
import Logo from './logo.svg';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from './DataContext'; // Importar el hook del contexto

function HomePage() {
  const navigate = useNavigate();
  const { setAgentData } = useDataContext(); // Usar el hook para acceder al contexto
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension !== 'xlsx') {
        setSnackbarMessage('El archivo debe ser de tipo .xlsx');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      setFileName(file.name);
      setLoading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convertir el contenido de la hoja a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Extraer los nombres de los agentes
          const agentData = jsonData.map(item => ({
            agentName: item['AGENTE'], // Cambia esto según tu estructura de datos
            // Puedes agregar más propiedades si lo necesitas
          })).filter(item => item.agentName); // Filtrar solo los nombres válidos

          setAgentData(agentData); // Establecer los datos en el contexto

          setSnackbarMessage('Archivo cargado exitosamente.');
          setSnackbarSeverity('success');
          navigate('/analysis'); // Navegar a la página de análisis
        } catch (error) {
          setSnackbarMessage('Error al procesar el archivo.');
          setSnackbarSeverity('error');
        } finally {
          setLoading(false);
          setOpenSnackbar(true);
        }
      };
      
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }}
      />

      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: 1200,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Análisis rápido
              </Typography>
              <Typography variant="body2">
                Realiza análisis instantáneos de tus datos con un solo clic.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <motion.img
                src={Logo}
                alt="Logo de Clarence"
                style={{ width: 100, marginBottom: 20 }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }} // Logo giratorio más lento
              />

              <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Bienvenido a Clarence
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Carga tu archivo XLSX para comenzar el análisis.
              </Typography>

              <Button
                variant="contained"
                component="label"
                startIcon={loading ? <CircularProgress size={20} /> : <UploadFileIcon />}
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  borderRadius: 2,
                  backgroundColor: '#5e17eb',
                  '&:hover': { backgroundColor: '#4712b9' },
                }}
                disabled={loading}
              >
                {loading ? 'Cargando...' : fileName ? `Archivo: ${fileName}` : 'Cargar archivo XLSX'}
                <input
                  type="file"
                  accept=".xlsx"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Soporte
              </Typography>
              <Typography variant="body2">
                Si tienes alguna pregunta, contáctanos a través de nuestro soporte.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: snackbarSeverity === 'success' ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)',
              padding: '10px 20px',
              borderRadius: '5px',
              boxShadow: 'none',
              height: '40px',
            }}
          >
            {snackbarSeverity === 'success' ? (
              <CheckCircleIcon sx={{ color: 'white', marginRight: 1 }} />
            ) : (
              <ErrorIcon sx={{ color: 'white', marginRight: 1 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                marginLeft: 1,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 'bold',
              }}
            >
              {snackbarMessage}
            </Typography>
          </Box>
        }
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          padding: '10px 0',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold',
        }}
      >
        &copy; {new Date().getFullYear()} Clarence. Todos los derechos reservados.
      </Box>
    </Box>
  );
}

export default HomePage;