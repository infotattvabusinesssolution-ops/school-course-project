import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modals State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeAuthModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
      } catch (error) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.data);
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      return { success: true, message: data.message, user: data.data };
    } catch (error) {
      console.error('Login error:', error);
      const message = 
        error.response?.data?.message || 
        (error.message === 'Network Error' 
          ? 'Unable to reach the server. Please check your network or ensure backend server is running.' 
          : error.message) || 
        'Login failed';
      return { 
        success: false, 
        message 
      };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post('/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(data.data);
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Registration error:', error);
      const message = 
        error.response?.data?.message || 
        (error.message === 'Network Error' 
          ? 'Unable to reach the server. Please check your network or ensure backend server is running.' 
          : error.message) || 
        'Registration failed';
      return { 
        success: false, 
        message 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      isLoginModalOpen,
      isRegisterModalOpen,
      openLogin,
      openRegister,
      closeAuthModals
    }}>
      {children}
    </AuthContext.Provider>
  );
};
