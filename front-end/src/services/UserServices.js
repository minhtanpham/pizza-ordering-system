import { publicRequest } from './HttpServices';

const loginURL = 'auth/login';

// /api/auth/login
export const userLogin = data => publicRequest(loginURL, {
  method: 'POST',
  data,
});

export const userLogout = data => publicRequest(loginURL, {
  method: 'POST',
  data,
});
