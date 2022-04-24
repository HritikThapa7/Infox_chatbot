import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();
const { Provider } = AppContext;

const AppProvider = ({ children }) => {
  const [userMode, setUserMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [message, setMessage] = useState('');
  const handleAlert = (
    obj = {
      type: 'error',
      message: 'Something went wrong!'
    }
  ) => {
    setShowAlert(true);
    setSeverity(obj.type);
    setMessage(obj.message);
  };

  // useEffect(() => {
  //   if (userMode) {
  //   }
  // }, [nagivate, userMode]);

  return (
    <Provider
      value={{
        handleAlert,
        showAlert,
        setShowAlert,
        severity,
        message,
        userMode,
        setUserMode
      }}
    >
      {children}
    </Provider>
  );
};

export { AppContext, AppProvider };
