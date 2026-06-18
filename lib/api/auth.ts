import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { AuthResponseDto, AuthUserDto } from '../../types/auth';

export interface MeResponse extends AuthResponseDto {
  user: AuthUserDto;
}

export async function getCurrentUser(): Promise<MeResponse> {
  return apiRequest<MeResponse>(apiEndpoints.me, { method: 'GET' });
}

export async function logout(): Promise<AuthResponseDto> {
  return apiRequest<AuthResponseDto>(apiEndpoints.logout, { method: 'POST' });
}
