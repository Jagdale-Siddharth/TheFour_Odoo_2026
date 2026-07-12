import httpClient from './httpClient';
import { USE_MOCK, mockDelay } from './apiMode';
import { ROLES } from '../../constants/status';

// Builds an unsigned mock JWT purely so useAuth() can decode a role/name
// for local development. Replace with a real backend token once Member 1's
// auth API is live — nothing else in the app needs to change.
function buildMockToken(role, name) {
  const header = btoa(JSON.stringify({ alg: 'none' }));
  const payload = btoa(JSON.stringify({ role, name, exp: Date.now() / 1000 + 8 * 3600 }));
  return `${header}.${payload}.mock`;
}

export async function login(email, password) {
  if (USE_MOCK) {
    const role = email.startsWith('dispatch') ? ROLES.DISPATCHER : ROLES.FLEET_MANAGER;
    const token = buildMockToken(role, email.split('@')[0]);
    return mockDelay({ token });
  }
  // Real endpoint — backend contract: POST /auth/login
  return httpClient.post('/auth/login', { email, password });
}
