import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, registerGoogleSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isGoogle = Boolean(body.googleId);

    const dob = body.dob as string | undefined;
    const consentAt = body.consentAt as string | undefined;

    if (!dob || !consentAt) {
      return NextResponse.json(
        { error: "Age verification and consent are required." },
        { status: 400 }
      );
    }

    // Server-side age re-check (never trust the client alone)
    const dobDate = new Date(dob);
    const age = Math.floor(
      (Date.now() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    if (age < 18) {
      return NextResponse.json(
        { error: "You must be 18 or older to register." },
        { status: 403 }
      );
    }

    if (isGoogle) {
      const parsed = registerGoogleSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0].message },
          { status: 422 }
        );
      }

      const { name, email, phone, gender, googleId } = parsed.data;

      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { googleId }] },
      });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          gender,
          googleId,
          dob: dobDate,
          consentAt: new Date(consentAt),
          firstLoginAt: new Date(),
        },
      });

      return NextResponse.json({ id: user.id }, { status: 201 });
    } else {
      const parsed = registerSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0].message },
          { status: 422 }
        );
      }

      const { name, email, phone, gender, password } = parsed.data;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      const hashed = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          gender,
          password: hashed,
          dob: dobDate,
          consentAt: new Date(consentAt),
        },
      });

      return NextResponse.json({ id: user.id }, { status: 201 });
    }
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
