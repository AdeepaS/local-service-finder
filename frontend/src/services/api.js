import axiosInstance from './axiosInstance';

export * from './bookingApi';
export * from './favoriteApi';
export * from './addressApi';
export * from './reviewApi';
export * from './userApi';

// Public Services API
export const fetchServices = async (params = {}) => {
  const { data } = await axiosInstance.get('/services', { params });
  return data;
};

export const fetchServiceById = async (id) => {
  const { data } = await axiosInstance.get(`/services/${id}`);
  return data;
};

// Provider Services API
export const fetchMyServices = async () => {
  const { data } = await axiosInstance.get('/services/provider/my-services');
  return data;
};

export const createService = async (formData) => {
  // formData because we are uploading images
  const { data } = await axiosInstance.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateService = async (id, formData) => {
  const { data } = await axiosInstance.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteService = async (id) => {
  const { data } = await axiosInstance.delete(`/services/${id}`);
  return data;
};

// Admin Services API
export const fetchAllAdminServices = async () => {
  const { data } = await axiosInstance.get('/services/admin/all');
  return data;
};

export const approveService = async (id) => {
  const { data } = await axiosInstance.patch(`/services/${id}/approve`);
  return data;
};

export const rejectService = async (id) => {
  const { data } = await axiosInstance.patch(`/services/${id}/reject`);
  return data;
};
