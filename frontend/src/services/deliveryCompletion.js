const safeBackendMessage = (error) => (
  typeof error?.message === 'string' && error.message.trim() && error.status === 409
    ? error.message.trim()
    : null
);

export function completionErrorMessage(error) {
  if (!error?.status) return 'Unable to connect to the backend service.';

  switch (error.status) {
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You are not allowed to complete this delivery.';
    case 404:
      return 'Delivery not found.';
    case 409:
      return safeBackendMessage(error) || 'Delivery is already completed.';
    default:
      return error.status >= 500
        ? 'Unable to complete the delivery because of a server error.'
        : 'Unable to complete the delivery.';
  }
}

export function createCompletionGuard() {
  const activeIds = new Set();
  return {
    begin(id) {
      if (activeIds.has(id)) return false;
      activeIds.add(id);
      return true;
    },
    end(id) {
      activeIds.delete(id);
    },
  };
}
