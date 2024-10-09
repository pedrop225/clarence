import React, { createContext, useState } from 'react';

// Crea el contexto
export const DataContext = createContext();

// Componente proveedor del contexto
export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]); // Almacena los datos cargados del archivo Excel

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};