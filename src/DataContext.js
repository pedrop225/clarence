import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const DataContext = createContext();

// Proveedor del contexto
export const DataProvider = ({ children }) => {
  const [agentNames, setAgentNames] = useState([]);

  return (
    <DataContext.Provider value={{ agentNames, setAgentNames }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar el contexto
export const useDataContext = () => {
  return useContext(DataContext);
};