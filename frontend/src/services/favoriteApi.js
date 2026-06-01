import axiosInstance from './axiosInstance';

export const getFavorites = async (params = {}) => {
  const { data } = await axiosInstance.get('/favorites', { params });
  return data;
};

export const addFavorite = async (serviceId) => {
  const { data } = await axiosInstance.post('/favorites', { serviceId });
  return data;
};

export const removeFavorite = async (serviceId) => {
  const { data } = await axiosInstance.delete(`/favorites/${serviceId}`);
  return data;
};

export const toggleFavorite = async (serviceId) => {
  const { data } = await axiosInstance.post(`/favorites/${serviceId}/toggle`);
  return data;
};

export const checkIsFavorited = async (serviceId) => {
  const { data } = await axiosInstance.get(`/favorites/${serviceId}/check`);
  return data;
};
