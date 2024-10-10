import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const DataContext = createContext();

// Proveedor del contexto
export const DataProvider = ({ children }) => {
  const [agentData, setAgentData] = useState([]);

  useEffect(() => {
    // Simulación de carga de datos, reemplaza esto con tu lógica de carga
    const fetchData = async () => {
      try {
        const response = await fetch('/path/to/your/excel/data'); // Cambia esto a tu fuente de datos
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Ajusta según el formato de tu archivo
        setAgentData(data);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ agentData, setAgentData }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar el contexto
export const useDataContext = () => {
  return useContext(DataContext);
};