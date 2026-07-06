import { httpClient } from './httpClient';

const AUTH_USER_KEY = 'smartDelivery.authUser';

function getAuthConfig() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.email || !user?.password) {
    throw {
      message: 'Please sign in again before optimizing routes.',
      status: 401,
    };
  }

  return {
    headers: {
      Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`,
    },
  };
}

function normalizeRouteError(error) {
  if (!error.response) {
    return {
      message: error.message || 'Unable to optimize the route.',
      status: error.status,
    };
  }

  return {
    message: error.response.data?.message || 'Unable to optimize the route.',
    status: error.response.status,
  };
}

export const routeService = {
  optimizeRoute: async () => {
    try {
      const { data } = await httpClient.get('/api/routes/optimize', getAuthConfig());
      return data;
    } catch (error) {
      throw normalizeRouteError(error);
    }
  },
};
