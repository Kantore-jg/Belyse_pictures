import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export const photoService = {
  getPhotos: async () => {
    const response = await api.get('/photos');
    return response.data;
  },
  uploadPhotos: async (formData) => {
    const response = await api.post('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  deletePhoto: async (id) => {
    await api.delete(`/photos/${id}`);
  },
};

export const eventService = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  createEvent: async (event) => {
    const response = await api.post('/events', event);
    return response.data;
  },
  deleteEvent: async (id) => {
    await api.delete(`/events/${id}`);
  },
};

export const bookingService = {
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  createBooking: async (booking) => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}`, { status });
    return response.data;
  },
};

export const messageService = {
  getMessages: async () => {
    const response = await api.get('/messages');
    return response.data;
  },
  sendMessage: async (message) => {
    const response = await api.post('/messages', message);
    return response.data;
  },
};
