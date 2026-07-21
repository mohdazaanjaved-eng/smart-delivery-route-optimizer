import { httpClient } from '../api/apiClient';

const AUTH_USER_KEY = 'smartDelivery.authUser';

function getAuthConfig() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.email || !user?.password) {
    throw {
      message: 'Please sign in again before managing deliveries.',
      validationErrors: {},
      status: 401,
    };
  }

  return {
    headers: {
      Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`,
    },
  };
}

function normalizeDeliveryError(error) {
  if (!error.response) {
    return {
      message: error.message || 'Unable to complete the delivery request.',
      validationErrors: error.validationErrors || {},
      status: error.status,
    };
  }

  const response = error.response.data;

  return {
    message: response?.message || 'Unable to complete the delivery request.',
    validationErrors: response?.validationErrors || {},
    status: error.response.status,
  };
}

async function withDeliveryErrorHandling(request) {
  try {
    return await request();
  } catch (error) {
    throw normalizeDeliveryError(error);
  }
}

export const deliveryService = {
  getAllDeliveries: async () =>
    withDeliveryErrorHandling(async () => {
      const { data } = await httpClient.get('/api/deliveries', getAuthConfig());
      return data;
    }),

  createDelivery: async (payload) =>
    withDeliveryErrorHandling(async () => {
      const { data } = await httpClient.post('/api/deliveries', payload, getAuthConfig());
      return data;
    }),

  updateDelivery: async (id, payload) =>
    withDeliveryErrorHandling(async () => {
      const { data } = await httpClient.put(`/api/deliveries/${id}`, payload, getAuthConfig());
      return data;
    }),

  deleteDelivery: async (id) =>
    withDeliveryErrorHandling(async () => {
      await httpClient.delete(`/api/deliveries/${id}`, getAuthConfig());
    }),
};
