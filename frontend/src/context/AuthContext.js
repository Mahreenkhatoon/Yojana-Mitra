import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('sgs_user')); } catch { return null; }
  });
  const [token,   setToken]   = useState(() => localStorage.getItem('sgs_token') || null);
  const [loading, setLoading] = useState(false);

  // Persist user/token in localStorage
  useEffect(() => {
    if (token) localStorage.setItem('sgs_token', token);
    else       localStorage.removeItem('sgs_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('sgs_user', JSON.stringify(user));
    else      localStorage.removeItem('sgs_user');
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'Unable to connect to the server. Please verify the server is running.'
          : err.message || 'Registration failed. Please check your details and try again.');
      return {
        success: false,
        message,
        errors: err.response?.data?.errors || [],
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = (updated) => setUser((prev) => ({ ...prev, ...updated }));

  const refreshUser = async () => {
    if (!token) return;
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
    } catch { logout(); }
  };

  const isAdmin = user?.role === 'admin';
  const isAuth  = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser, isAdmin, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
