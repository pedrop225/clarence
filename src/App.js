import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from './HomePage';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HomePage />
    </ThemeProvider>
  );
}

export default App;