import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

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
  updatePhoto: async (id, data) => {
    const response = await api.put(`/photos/${id}`, data);
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
  createEvent: async (formData) => {
    const response = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  updateEvent: async (id, formData) => {
    const response = await api.post(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
  updateBookingStatus: async (id, status, adminResponse = null) => {
    const payload = { status };
    if (adminResponse) payload.adminResponse = adminResponse;
    const response = await api.patch(`/bookings/${id}`, payload);
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
