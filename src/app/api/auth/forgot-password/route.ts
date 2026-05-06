import { NextRequest, NextResponse } from "next/server";
import { redis, OTP_TTL_SECONDS, OTP_MAX_RESENDS, otpKey, otpResendKey } from "@/lib/redis";
import { sendOtpEmail } from "@/lib/email";
import { forgotPasswordEmailSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Always return the same message regardless of whether email exists (enumeration prevention)
const SAFE_RESPONSE = {
  message: "If an account with that email exists, a reset code has been sent.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 422 }
      );
    }

    const { email } = parsed.data;

    // Check resend count — silently cap without leaking whether email exists
    const resendCount = await redis.get(otpResendKey(email));
    if (resendCount && parseInt(resendCount) >= OTP_MAX_RESENDS) {
      return NextResponse.json(SAFE_RESPONSE);
    }

    // Only send email if user exists (done silently — same response either way)
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const otp = generateOtp();
      await redis.setex(otpKey(email), OTP_TTL_SECONDS, otp);

      const pipeline = redis.pipeline();
      pipeline.incr(otpResendKey(email));
      pipeline.expire(otpResendKey(email), OTP_TTL_SECONDS);
      await pipeline.exec();

      await sendOtpEmail(email, otp);
    }

    return NextResponse.json(SAFE_RESPONSE);
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
