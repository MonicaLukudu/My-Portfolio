import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  getAuthHeaders: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('admin_username'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (err) {
        console.error("Auth verification failed, network error:", err);
        // On network error, keep current local authenticated state as fallback
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isLoading, username, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
