import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [agentData, setAgentData] = useState([]); // Estado para almacenar todos los datos

  return (
    <DataContext.Provider value={{ agentData, setAgentData }}>
      {children}
    </DataContext.Provider>
  );
};