import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children, template, account }) => {
  const [isConnected, setConnected] = useState(false);
  const contextValue = {
    isConnected,
    setConnected,
    account,
    template,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext };
