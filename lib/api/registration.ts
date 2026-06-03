import { apiEndpoints } from '../../lib/api/endpoint';

export interface RegistrationRequest {
  heroName: string;
  email: string;
  password: string;
}

export interface RegistrationOtpVerificationRequest {
  email: string;
  code: string;
}

export interface RegistrationResponse {
  ok: boolean;
  message: string;
}

export interface RegistrationVerificationResponse extends RegistrationResponse {
  user?: {
    heroName: string;
    email: string;
  };
}

export async function requestRegistrationOtp(request: RegistrationRequest): Promise<RegistrationResponse> {
  const response = await fetch(apiEndpoints.registrationRequestOtp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  const data = (await response.json()) as RegistrationResponse;
  if (!response.ok) {
    throw new Error(data.message || 'Unable to send OTP');
  }

  return data;
}

export async function verifyRegistrationOtp(
  request: RegistrationOtpVerificationRequest
): Promise<RegistrationVerificationResponse> {
  const response = await fetch(apiEndpoints.registrationVerifyOtp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  const data = (await response.json()) as RegistrationVerificationResponse;
  if (!response.ok) {
    throw new Error(data.message || 'Unable to verify OTP');
  }

  return data;
}