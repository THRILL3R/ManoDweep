import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resetToken } = body as { resetToken?: string };

    if (!resetToken) {
      return NextResponse.json(
        { error: "Reset token is required." },
        { status: 400 }
      );
    }

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 }
      );
    }

    const { password } = parsed.data;

    // Validate reset token
    const email = await redis.get(`reset_token:${resetToken}`);
    if (!email) {
      return NextResponse.json(
        { error: "This reset link has expired. Please start again." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    // Immediately invalidate the reset token
    await redis.del(`reset_token:${resetToken}`);

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
