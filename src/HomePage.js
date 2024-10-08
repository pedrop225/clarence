import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import Logo from './logo.svg'; // Asegúrate de que la ruta es correcta
import BackgroundImage from './background.jpeg'; // Importa la imagen de fondo

function HomePage() {
  const [data, setData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      console.log(jsonData);
      setOpenSnackbar(true);
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
      {/* Imagen de fondo */}
      <Box
        sx={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.7)', // Añade oscuridad a la imagen
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -2,
        }}
      />

      {/* Capa de transparencia */}
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Ajusta la transparencia aquí
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Card
            sx={{
              maxWidth: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Transparencia en la tarjeta
              borderRadius: 3,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              mx: 2,
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              {/* Logo en la parte superior */}
              <img
                src={Logo}
                alt="Logo de Clarence"
                style={{ width: 80, marginBottom: 20 }}
              />
              <Typography variant="h3" gutterBottom>
                Bienvenido a Clarence
              </Typography>
              <Typography variant="body1" gutterBottom>
                Por favor, carga tu archivo Excel para comenzar el análisis.
              </Typography>
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                component="label"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#5e17eb',
                  },
                }}
              >
                Cargar Archivo Excel
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

      {/* Snackbar de confirmación */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Archivo cargado exitosamente.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HomePage;