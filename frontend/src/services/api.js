import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const fetchUsers = (params) => api.get('/users/getUserList', { params });

export const fetchHotels = (params) => api.get('/hotels/getHotelList', { params });

export const fetchBookings = (params) => api.get('/bookings/getBookings', { params });

export const createBooking = (data) => api.post('/bookings/createBooking', data);

export const cancelBooking = (bookingId) => api.post(`/bookings/${bookingId}/cancel`);

export const fetchStates = () => api.get('/state');

export const fetchCities = (state) => api.get('/city', { params: state ? { state } : {} });

export const downloadBookings = (params) => {
  const queryParams = new URLSearchParams({ ...params, download: 'true' }).toString();
  window.open(`/api/bookings/getBookings?${queryParams}`, '_blank');
};
