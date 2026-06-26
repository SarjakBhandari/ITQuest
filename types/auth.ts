export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface SignupRequestDto {
  heroName: string;
  email: string;
  password: string;
}

export interface RegistrationOtpVerificationDto {
  email: string;
  code: string;
}

export interface AuthResponseDto {
  ok: boolean;
  message: string;
}

export interface AuthUserDto {
  heroName: string;
  email: string;
  isAdmin?: boolean;
}

export interface LoginResponseDto extends AuthResponseDto {
  user?: AuthUserDto;
}

export interface RegistrationVerificationResponseDto extends AuthResponseDto {
  user?: AuthUserDto;
}