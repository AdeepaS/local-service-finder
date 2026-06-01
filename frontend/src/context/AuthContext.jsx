import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import { getProfile } from '../services/userApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshProfile = useCallback(async () => {
    const res = await getProfile();
    setUser(res.data);
    return res.data;
  }, []);

  const applyToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
    setAccessToken(token);
  };

  const loadSession = useCallback(async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh');
      applyToken(res.data.accessToken);

      const profile = await getProfile();
      setUser(profile.data);
    } catch {
      setUser(null);
      applyToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    const handleLogout = () => {
      setUser(null);
      applyToken(null);
      navigate('/login');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [loadSession, navigate]);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    applyToken(res.data.accessToken);
    const profile = await getProfile();
    setUser(profile.data);
    navigate('/dashboard');
  };

  const register = async (name, email, password, role) => {
    const res = await axiosInstance.post('/auth/register', { name, email, password, role });
    applyToken(res.data.accessToken);
    const profile = await getProfile();
    setUser(profile.data);
    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    applyToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
