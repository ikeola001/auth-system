import { createContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Check if user is logged in on app load ──────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/profile');
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ─── Login ────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  // ─── Register ─────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    } catch (error) {
      console.log('AuthContext register error:', error.message);
      throw error;
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  // ─── Update user state after profile update ───────────────────────
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};