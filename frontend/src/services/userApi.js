import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const { data } = await axiosInstance.get('/users/profile');
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.put('/users/profile', payload);
  return data;
};

export const updateAvatar = async (imageUrl) => {
  const { data } = await axiosInstance.put('/users/avatar', { imageUrl });
  return data;
};

export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const { data } = await axiosInstance.put('/users/change-password', {
    currentPassword,
    newPassword,
    confirmPassword: confirmPassword ?? newPassword,
  });
  return data;
};
