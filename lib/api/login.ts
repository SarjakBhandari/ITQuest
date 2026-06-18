import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { LoginRequestDto, LoginResponseDto } from '../../types/auth';

export type LoginRequest = LoginRequestDto;
export type LoginResponse = LoginResponseDto;

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(apiEndpoints.login, {
    method: 'POST',
    body: JSON.stringify(request)
  });
}
