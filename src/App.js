import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { DataProvider } from './DataContext';
import HomePage from './HomePage';
import AnalysisPage from './AnalysisPage';

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