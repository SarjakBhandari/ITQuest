import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type {
  AuthResponseDto,
  RegistrationOtpVerificationDto,
  RegistrationVerificationResponseDto,
  SignupRequestDto
} from '../../types/auth';

export type RegistrationRequest = SignupRequestDto;
export type RegistrationOtpVerificationRequest = RegistrationOtpVerificationDto;
export type RegistrationResponse = AuthResponseDto;
export type RegistrationVerificationResponse = RegistrationVerificationResponseDto;

export async function requestRegistrationOtp(request: RegistrationRequest): Promise<RegistrationResponse> {
  return apiRequest<RegistrationResponse>(apiEndpoints.registrationRequestOtp, {
    method: 'POST',
    body: JSON.stringify(request)
  });
}

export async function verifyRegistrationOtp(
  request: RegistrationOtpVerificationRequest
): Promise<RegistrationVerificationResponse> {
  return apiRequest<RegistrationVerificationResponse>(apiEndpoints.registrationVerifyOtp, {
    method: 'POST',
    body: JSON.stringify(request)
  });
}
