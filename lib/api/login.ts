import { apiEndpoints } from '../../lib/api/endpoint';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  message: string;
  user?: {
    heroName: string;
    email: string;
  };
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(apiEndpoints.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  const data = (await response.json()) as LoginResponse;
  if (!response.ok) {
    throw new Error(data.message || 'Unable to sign in');
  }

  return data;
}