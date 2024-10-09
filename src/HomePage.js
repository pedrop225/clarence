import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import './HomePage.css';

function HomePage() {
  const [fileName, setFileName] = useState('');

  // Manejar la subida de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      setFileName(file.name); // Mostrar el nombre del archivo
      // Aquí puedes procesar el archivo (leerlo, etc.)
      alert(`Archivo "${file.name}" subido con éxito.`);
    }
  };

  return (
    <Box className="home-container">
      <Typography variant="h3" gutterBottom>
        ¡Bienvenido a Clarence!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sube tu archivo para comenzar el análisis.
      </Typography>
      <Button 
        variant="contained" 
        component="label" 
        className="upload-button"
      >
        Subir Archivo
        <input 
          type="file" 
          hidden 
          accept=".xlsx" // Limita la selección a archivos Excel
          onChange={handleFileUpload} 
        />
      </Button>
      {fileName && ( // Si se ha seleccionado un archivo, mostrar su nombre
        <Typography variant="body2" className="file-name">
          Archivo seleccionado: {fileName}
        </Typography>
      )}
    </Box>
  );
}

export default HomePage;