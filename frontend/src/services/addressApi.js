import axiosInstance from './axiosInstance';

export const getAddresses = async () => {
  const { data } = await axiosInstance.get('/addresses');
  return data;
};

export const getDefaultAddress = async () => {
  const { data } = await axiosInstance.get('/addresses/default');
  return data;
};

export const createAddress = async (payload) => {
  const { data } = await axiosInstance.post('/addresses', payload);
  return data;
};

export const updateAddress = async (addressId, payload) => {
  const { data } = await axiosInstance.put(`/addresses/${addressId}`, payload);
  return data;
};

export const deleteAddress = async (addressId) => {
  const { data } = await axiosInstance.delete(`/addresses/${addressId}`);
  return data;
};

export const setDefaultAddress = async (addressId) => {
  const { data } = await axiosInstance.put(`/addresses/${addressId}/set-default`);
  return data;
};
