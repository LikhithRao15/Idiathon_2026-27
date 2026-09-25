'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const router = useRouter();

  // Load session on initial mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ideathon_token');
    const savedUser = localStorage.getItem('ideathon_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      }
      // Verify profile from backend
      fetchProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message, isError = false) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, isError }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchProfile = async (authToken) => {
    const res = await apiRequest('/auth/me', {}, authToken);
    const payload = res.data || {};
    const userData = payload.user || payload;

    if (res.ok && userData && userData.email) {
      setUser(userData);
      localStorage.setItem('ideathon_user', JSON.stringify(userData));
    } else {
      logout(false);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const payload = res.data || {};
    const authToken = payload.token || (res.raw?.data?.token);
    const userData = payload.user || (res.raw?.data?.user);

    if (res.ok && authToken && userData) {
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('ideathon_token', authToken);
      localStorage.setItem('ideathon_user', JSON.stringify(userData));
      showToast(`Welcome back, ${userData.name}!`);

      // Smart redirect
      if (userData.role === 'participant') router.push('/#pitch');
      else if (userData.role === 'panelist') router.push('/panelist');
      else if (userData.role === 'admin') router.push('/admin');

      return { success: true };
    } else {
      showToast(res.message || 'Login failed', true);
      return { success: false, message: res.message };
    }
  };

  const registerParticipant = async (formData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        role: 'participant',
      }),
    });

    const payload = res.data || {};
    const authToken = payload.token || (res.raw?.data?.token);
    const userData = payload.user || (res.raw?.data?.user);

    if (res.ok && authToken && userData) {
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('ideathon_token', authToken);
      localStorage.setItem('ideathon_user', JSON.stringify(userData));
      showToast(`Registration successful! Welcome, ${userData.name}.`);
      router.push('/#pitch');
      return { success: true };
    } else {
      showToast(res.message || 'Registration failed', true);
      return { success: false, message: res.message };
    }
  };

  const logout = (showMsg = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ideathon_token');
    localStorage.removeItem('ideathon_user');
    if (showMsg) showToast('Logged out successfully');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        registerParticipant,
        logout,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card ${t.isError ? 'toast-error' : 'toast-success'}`}>
            <span>{t.isError ? '⚠️' : '✅'}</span>
            <p>{t.message}</p>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
