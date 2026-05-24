import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// OTP TTL: 15 minutes
export const OTP_TTL_SECONDS = 15 * 60;

// Rate limiting: 30-minute block after 5 failures
export const OTP_FAIL_BLOCK_SECONDS = 30 * 60;
export const OTP_MAX_FAILURES = 5;
export const OTP_MAX_RESENDS = 3;

export function otpKey(email: string) {
  return `otp:${email}`;
}
export function otpFailKey(email: string) {
  return `otp_fail:${email}`;
}
export function otpResendKey(email: string) {
  return `otp_resend:${email}`;
}
