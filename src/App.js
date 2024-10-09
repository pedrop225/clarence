import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AnalysisPage from './AnalysisPage';
import { DataProvider } from './DataContext'; // Importamos el DataProvider

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;