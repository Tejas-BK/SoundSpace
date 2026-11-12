import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('soundspace_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify stored token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('soundspace_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('[AuthContext] Session expired or invalid:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data.data;
        localStorage.setItem('soundspace_token', receivedToken);
        localStorage.setItem('soundspace_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
      return {
        success: false,
        message: res.data.message || 'Login failed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials or server unavailable'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      }
      return {
        success: false,
        message: res.data.message || 'Registration failed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please check your details.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('soundspace_token');
    localStorage.removeItem('soundspace_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
