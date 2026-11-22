import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const freshData = await getCurrentUser();
          setUser(freshData);
          localStorage.setItem('auth_user', JSON.stringify(freshData));
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (username, password) => {
    const data = await loginUser(username, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
