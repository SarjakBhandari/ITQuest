export interface PendingRegistration {
  heroName: string;
  email: string;
  password: string;
  otp: string;
  expiresAt: number;
}

export interface RegisteredUser {
  heroName: string;
  email: string;
  password: string;
  registeredAt: string;
}

export interface RegistrationResult {
  otp: string;
  expiresAt: number;
}

const otpTtlMs = 10 * 60 * 1000;

const pendingRegistrations = new Map<string, PendingRegistration>();
const registeredUsers = new Map<string, RegisteredUser>();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createPendingRegistration(heroName: string, email: string, password: string): RegistrationResult {
  const otp = generateOtp();
  const expiresAt = Date.now() + otpTtlMs;

  pendingRegistrations.set(email.toLowerCase(), {
    heroName,
    email,
    password,
    otp,
    expiresAt
  });

  return { otp, expiresAt };
}

export function verifyPendingRegistration(email: string, otp: string) {
  const pending = pendingRegistrations.get(email.toLowerCase());
  if (!pending) {
    return { ok: false as const, message: 'No OTP request found for that email.' };
  }

  if (pending.expiresAt < Date.now()) {
    pendingRegistrations.delete(email.toLowerCase());
    return { ok: false as const, message: 'OTP has expired. Please request a new one.' };
  }

  if (pending.otp !== otp) {
    return { ok: false as const, message: 'Invalid OTP. Please try again.' };
  }

  const user: RegisteredUser = {
    heroName: pending.heroName,
    email: pending.email,
    password: pending.password,
    registeredAt: new Date().toISOString()
  };

  registeredUsers.set(email.toLowerCase(), user);
  pendingRegistrations.delete(email.toLowerCase());

  return { ok: true as const, message: 'Registration completed.', user };
}

export function authenticateUser(email: string, password: string) {
  const user = registeredUsers.get(email.toLowerCase());
  if (!user) {
    return { ok: false as const, message: 'No account found. Please register first.' };
  }

  if (user.password !== password) {
    return { ok: false as const, message: 'Incorrect email or password.' };
  }

  return { ok: true as const, message: 'Login successful.', user };
}