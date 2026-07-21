export const isCompletedStatus = (status) => status === 'COMPLETED' || status === 'DELIVERED';
export const normalizedStatus = (status) => isCompletedStatus(status) ? 'COMPLETED' : status === 'ASSIGNED' ? 'PENDING' : (status || 'PENDING');
export const deliveryAction = (status) => {
  if (status === 'PENDING' || status === 'ASSIGNED') return 'START';
  if (status === 'IN_PROGRESS') return 'COMPLETE';
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'DELIVERED') return 'DELIVERED';
  return 'NONE';
};
export const deliveryCounts = (deliveries) => ({
  pending: deliveries.filter((d) => normalizedStatus(d.status) === 'PENDING').length,
  inProgress: deliveries.filter((d) => normalizedStatus(d.status) === 'IN_PROGRESS').length,
  completed: deliveries.filter((d) => normalizedStatus(d.status) === 'COMPLETED').length,
});
export function startErrorMessage(error) {
  if (!error?.status) return 'Unable to connect to the backend service.';
  if (error.status === 401) return 'Your session has expired. Please sign in again.';
  if (error.status === 403) return 'You are not allowed to start this delivery.';
  if (error.status === 404) return 'Delivery not found.';
  if (error.status === 409) return typeof error.message === 'string' && error.message.trim() ? error.message.trim() : 'Unable to start this delivery.';
  if (error.status >= 500) return 'Unable to start the delivery because of a server error.';
  return 'Unable to start this delivery.';
}
export function createStartGuard() {
  const activeIds = new Set();
  return { begin(id) { if (activeIds.has(id)) return false; activeIds.add(id); return true; }, end(id) { activeIds.delete(id); } };
}
