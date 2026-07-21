import test from 'node:test';
import assert from 'node:assert/strict';
import { createStartGuard, deliveryAction, deliveryCounts, normalizedStatus, startErrorMessage } from './deliveryWorkflow.js';

test('shows the correct transition action for every workflow status', () => {
  assert.equal(deliveryAction('PENDING'), 'START');
  assert.equal(deliveryAction('ASSIGNED'), 'START');
  assert.equal(deliveryAction('IN_PROGRESS'), 'COMPLETE');
  assert.equal(deliveryAction('COMPLETED'), 'COMPLETED');
  assert.equal(deliveryAction('DELIVERED'), 'DELIVERED');
});

test('successful start object changes row action and dashboard counts', () => {
  const before = [{ id: 1, status: 'PENDING' }, { id: 2, status: 'COMPLETED' }];
  const returned = { id: 1, status: 'IN_PROGRESS', startedAt: '2026-07-22T10:30:00' };
  const after = before.map((delivery) => delivery.id === returned.id ? returned : delivery);
  assert.deepEqual(deliveryCounts(before), { pending: 1, inProgress: 0, completed: 1 });
  assert.deepEqual(deliveryCounts(after), { pending: 0, inProgress: 1, completed: 1 });
  assert.equal(deliveryAction(after[0].status), 'COMPLETE');
  assert.equal(normalizedStatus('ASSIGNED'), 'PENDING');
});

test('prevents duplicate start clicks', () => {
  const guard = createStartGuard();
  assert.equal(guard.begin(4), true);
  assert.equal(guard.begin(4), false);
  guard.end(4);
  assert.equal(guard.begin(4), true);
});

test('extracts stable start-delivery error messages', () => {
  assert.equal(startErrorMessage({ status: 401 }), 'Your session has expired. Please sign in again.');
  assert.equal(startErrorMessage({ status: 403 }), 'You are not allowed to start this delivery.');
  assert.equal(startErrorMessage({ status: 404 }), 'Delivery not found.');
  assert.equal(startErrorMessage({ status: 409, message: 'Delivery is already in progress.' }), 'Delivery is already in progress.');
  assert.equal(startErrorMessage({ status: 500 }), 'Unable to start the delivery because of a server error.');
  assert.equal(startErrorMessage({}), 'Unable to connect to the backend service.');
});
