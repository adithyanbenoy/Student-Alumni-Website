import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('alumni_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on load
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('alumni_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Session expired or invalid', err);
          logout();
        }
      } else {
        // Automatically default to Adithyan Benoy (student) for instant seamless demonstration if desired!
        // Or leave null until user logs in or uses quick demo switcher
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('alumni_token', res.data.token);
        localStorage.setItem('alumni_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('alumni_token', res.data.token);
        localStorage.setItem('alumni_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('alumni_token');
    localStorage.removeItem('alumni_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('alumni_user', JSON.stringify(updated));
  };

  // Quick 1-click switch between demo personas
  const quickLoginAs = async (email) => {
    return await login(email, 'Password@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        quickLoginAs,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
