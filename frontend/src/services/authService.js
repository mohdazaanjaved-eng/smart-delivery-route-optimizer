import { httpClient } from '../api/apiClient';

const AUTH_USER_KEY = 'smartDelivery.authUser';

function normalizeAuthError(error) {
  const response = error.response?.data;

  return {
    message: response?.message || 'Unable to complete the authentication request.',
    validationErrors: response?.validationErrors || {},
    status: error.response?.status,
  };
}

export const authService = {
  login: async (credentials) => {
    try {
      const { data } = await httpClient.post('/api/auth/login', credentials);
      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({
          ...data,
          password: credentials.password,
        }),
      );
      return data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  },

  register: async (payload) => {
    try {
      const { data } = await httpClient.post('/api/auth/register', payload);
      return data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  },

  getAuthenticatedUser: () => {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
