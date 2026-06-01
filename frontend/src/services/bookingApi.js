import axiosInstance from './axiosInstance';

export const createBooking = async (payload) => {
  const { data } = await axiosInstance.post('/bookings', payload);
  return data;
};

export const getCustomerBookings = async (params = {}) => {
  const { data } = await axiosInstance.get('/bookings/customer/my-bookings', { params });
  return data;
};

export const getProviderBookings = async (params = {}) => {
  const { data } = await axiosInstance.get('/bookings/provider/my-bookings', { params });
  return data;
};

export const getBookingById = async (bookingId) => {
  const { data } = await axiosInstance.get(`/bookings/${bookingId}`);
  return data;
};

export const acceptBooking = async (bookingId, body = {}) => {
  const { data } = await axiosInstance.put(`/bookings/${bookingId}/accept`, body);
  return data;
};

export const rejectBooking = async (bookingId, body = {}) => {
  const { data } = await axiosInstance.put(`/bookings/${bookingId}/reject`, body);
  return data;
};

export const startBooking = async (bookingId) => {
  const { data } = await axiosInstance.put(`/bookings/${bookingId}/start`);
  return data;
};

export const completeBooking = async (bookingId, body = {}) => {
  const { data } = await axiosInstance.put(`/bookings/${bookingId}/complete`, body);
  return data;
};

export const cancelBooking = async (bookingId, body = {}) => {
  const { data } = await axiosInstance.put(`/bookings/${bookingId}/cancel`, body);
  return data;
};
