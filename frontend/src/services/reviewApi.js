import axiosInstance from './axiosInstance';

export const createReview = async (payload) => {
  const { data } = await axiosInstance.post('/reviews', payload);
  return data;
};

export const getReviewsByService = async (serviceId) => {
  const { data } = await axiosInstance.get(`/reviews/${serviceId}`);
  return data;
};
