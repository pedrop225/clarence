import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, CircularProgress, Snackbar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono de correcto
import { motion } from 'framer-motion'; // Animaciones
import BackgroundImage from './background.jpeg';
import Logo from './logo.svg';

function HomePage() {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setLoading(true);

      // Simulación de procesamiento del archivo XLSX
      setTimeout(() => {
        setLoading(false);
        setOpenSnackbar(true); // Mostrar mensaje de éxito
        console.log('Archivo seleccionado:', file);
      }, 1500);
    }
  };

  // Función para cerrar el Snackbar
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
        overflow: 'hidden', // Para evitar que los elementos se salgan de los límites
      }}
    >
      {/* Imagen de fondo con animación */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }} // Efecto de zoom suave en la imagen de fondo
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
          zIndex: -2, // Mantener la imagen de fondo detrás de todos los elementos
        }}
      />

      {/* Capa de transparencia sobre el fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparencia ajustada
          zIndex: -1,
        }}
      />

      {/* Contenedor principal */}
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: 1200, // Limitar el ancho máximo
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)', // Espacio para el footer sin hacer scroll
        }}
      >
        {/* Tarjeta secundaria izquierda */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }} // Animación más lenta
          >
            <Card
              sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '15px',
                backdropFilter: 'blur(8px)', // Filtro de desenfoque
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.03)', // Efecto de hover
                  boxShadow: '0 16px 32px rgba(31, 38, 135, 0.6)',
                },
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
          </motion.div>
        </Grid>

        {/* Tarjeta principal */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              sx={{
                padding: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparencia en la tarjeta
                borderRadius: '15px',
                backdropFilter: 'blur(8px)', // Filtro de desenfoque
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 16px 32px rgba(31, 38, 135, 0.6)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {/* Logo con animación */}
                <motion.img
                  src={Logo}
                  alt="Logo de Clarence"
                  style={{ width: 100, marginBottom: 20 }}
                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Texto de bienvenida */}
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  Bienvenido a Clarence
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Carga tu archivo XLSX para comenzar el análisis.
                </Typography>

                {/* Botón para cargar archivo XLSX */}
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
                    accept=".xlsx" // Aceptar solo archivos XLSX
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Tarjeta secundaria derecha */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }} // Animación más lenta
          >
            <Card
              sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '15px',
                backdropFilter: 'blur(8px)', // Filtro de desenfoque
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.03)', // Efecto de hover
                  boxShadow: '0 16px 32px rgba(31, 38, 135, 0.6)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Exportación en PDF
                </Typography>
                <Typography variant="body2">
                  Genera informes de tus datos en formato PDF de manera sencilla.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Snackbar para mostrar mensaje de éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Posición del Snackbar
        message={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 40, // Reducir altura del Snackbar
              backgroundColor: 'rgba(76, 175, 80, 0.7)', // Color verde con transparencia
              borderRadius: 2,
              padding: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} /> {/* Icono de correcto en blanco */}
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                marginLeft: 1,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 'bold',
              }}
            >
              Archivo cargado exitosamente.
            </Typography>
          </Box>
        }
      />

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo del footer
          padding: 1, // Reducir altura del footer
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Clarence. Todos los derechos reservados.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Creado por Tu Nombre
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;