import test from 'node:test';
import assert from 'node:assert/strict';
import { completionErrorMessage, createCompletionGuard } from './deliveryCompletion.js';

test('maps completion failures to safe user-facing messages', () => {
  assert.equal(completionErrorMessage({ status: 401 }), 'Your session has expired. Please sign in again.');
  assert.equal(completionErrorMessage({ status: 403 }), 'You are not allowed to complete this delivery.');
  assert.equal(completionErrorMessage({ status: 404 }), 'Delivery not found.');
  assert.equal(completionErrorMessage({ status: 409, message: 'Delivery is already completed' }), 'Delivery is already completed');
  assert.equal(completionErrorMessage({ status: 500, message: 'An unexpected error occurred' }), 'Unable to complete the delivery because of a server error.');
  assert.equal(completionErrorMessage({}), 'Unable to connect to the backend service.');
});

test('prevents duplicate completion attempts for the same delivery', () => {
  const guard = createCompletionGuard();
  assert.equal(guard.begin(7), true);
  assert.equal(guard.begin(7), false);
  assert.equal(guard.begin(8), true);
  guard.end(7);
  assert.equal(guard.begin(7), true);
});
