import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axiosInstance.post('/auth/refresh');
        setAccessToken(res.data.accessToken);

        const meRes = await axiosInstance.get('/auth/me', {
          headers: { Authorization: `Bearer ${res.data.accessToken}` }
        });
        setUser(meRes.data.data);
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const handleLogout = () => {
      setUser(null);
      setAccessToken(null);
      navigate('/login');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [navigate]);

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
    setAccessToken(res.data.accessToken);
    setUser(res.data.data);
    navigate('/dashboard');
  };

  const register = async (name, email, password, role) => {
    const res = await axiosInstance.post('/auth/register', { name, email, password, role });
    setAccessToken(res.data.accessToken);
    setUser(res.data.data);
    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setAccessToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
