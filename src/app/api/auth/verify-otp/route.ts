import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  OTP_FAIL_BLOCK_SECONDS,
  OTP_MAX_FAILURES,
  otpKey,
  otpFailKey,
} from "@/lib/redis";
import { otpSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const parsed = otpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 }
      );
    }

    const { otp } = parsed.data;

    // Check if blocked
    const failCount = await redis.get(otpFailKey(email));
    if (failCount && parseInt(failCount) >= OTP_MAX_FAILURES) {
      return NextResponse.json(
        {
          error:
            "Too many failed attempts. Please wait 30 minutes before trying again.",
          blocked: true,
        },
        { status: 429 }
      );
    }

    // Get stored OTP
    const storedOtp = await redis.get(otpKey(email));

    if (!storedOtp || storedOtp !== otp) {
      // Increment failure count
      const pipeline = redis.pipeline();
      pipeline.incr(otpFailKey(email));
      pipeline.expire(otpFailKey(email), OTP_FAIL_BLOCK_SECONDS);
      await pipeline.exec();

      const newCount = parseInt(failCount ?? "0") + 1;
      const remaining = OTP_MAX_FAILURES - newCount;

      return NextResponse.json(
        {
          error:
            remaining > 0
              ? `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
              : "Too many failed attempts. Please wait 30 minutes before trying again.",
          blocked: remaining <= 0,
        },
        { status: 400 }
      );
    }

    // OTP is valid — delete it so it can't be reused
    await redis.del(otpKey(email));
    await redis.del(otpFailKey(email));

    // Issue a short-lived reset token
    const resetToken = crypto.randomUUID();
    await redis.setex(`reset_token:${resetToken}`, 10 * 60, email); // 10 min to complete reset

    return NextResponse.json({ resetToken });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
