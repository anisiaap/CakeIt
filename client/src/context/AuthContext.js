import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1])); // Decode token payload
        setIsAuthenticated(true);
        setUserRole(userData.role);
        setUserId(userData.id);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token'); // Clear invalid token
      }
    }
  }, []);

  return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated,setUserId,  userRole, userId, setUserRole }}>
        {children}
      </AuthContext.Provider>
  );
};
