import React, { useState, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataContext';
import Logo from './logo.svg';
import BackgroundImage from './background.jpeg';
import './HomePage.css'; // Archivo de estilo adicional

function HomePage() {
  const { setData } = useContext(DataContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Indicador de carga
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que el archivo sea de tipo Excel
    if (
      file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.type !== 'application/vnd.ms-excel'
    ) {
      setErrorMessage('Por favor, carga un archivo Excel válido (.xlsx).');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true); // Inicia la animación de carga

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      try {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData); // Almacenar los datos en el contexto
        setOpenSnackbar(true);

        // Navegar a la página de análisis después de un breve retraso
        setTimeout(() => {
          setLoading(false); // Detener la animación de carga
          navigate('/analysis');
        }, 1000);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        setErrorMessage(
          'Error al procesar el archivo. Asegúrate de que es un archivo Excel válido.'
        );
        setLoading(false); // Detener la animación de carga en caso de error
        setOpenSnackbar(true);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Imagen de fondo con efecto parallax */}
      <Box
        className="background"
        sx={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.5)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -2,
        }}
      />
      {/* Capa de transparencia */}
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      {/* Contenido principal */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99], // Efecto de "bounce"
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Transparencia en la tarjeta
              borderRadius: 3,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(8px)', // Efecto de desenfoque
              border: '1px solid rgba(255, 255, 255, 0.18)',
              mx: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)', // Eleva la tarjeta al hacer hover
                boxShadow: '0 16px 32px rgba(31, 38, 135, 0.6)', // Incrementa la sombra
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              {/* Logo en la parte superior */}
              <img
                src={Logo}
                alt="Logo de Clarence"
                style={{ width: 100, marginBottom: 20 }}
              />
              <Typography variant="h3" gutterBottom>
                Bienvenido a Clarence
              </Typography>
              <Typography variant="body1" gutterBottom>
                Por favor, carga tu archivo Excel para comenzar el análisis.
              </Typography>
              <Button
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <UploadFileIcon />
                }
                disabled={loading} // Deshabilitar el botón mientras carga
                component="label"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: loading ? null : '#5e17eb', // No cambiar color si está cargando
                  },
                }}
              >
                {loading ? 'Cargando...' : 'Cargar Archivo Excel'}
                <input
                  type="file"
                  accept=".xlsx"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
      {/* Snackbar para mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        {errorMessage ? (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, -10, 10, -10, 10, 0] }} // Efecto de vibración en error
            transition={{ duration: 0.3 }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="error"
              sx={{ width: '100%' }}
            >
              {errorMessage}
            </Alert>
          </motion.div>
        ) : (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Archivo cargado exitosamente.
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}

export default HomePage;