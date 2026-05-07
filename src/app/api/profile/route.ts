import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  phone: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")
    .optional(),
  dogName: z.string().min(1, "Dog name cannot be empty").max(50).optional(),
  aboutYourself: z.string().max(500).nullable().optional(),
  whatILove: z.string().max(500).nullable().optional(),
  whatMakesHappy: z.string().max(500).nullable().optional(),
  platformSuggestion: z.string().max(1000).nullable().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dob: true,
      gender: true,
      dogName: true,
      profilePicture: true,
      aboutYourself: true,
      whatILove: true,
      whatMakesHappy: true,
      platformSuggestion: true,
      coinBalance: true,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 }
    );

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { dogName: true, phone: true },
  });

  return NextResponse.json({ success: true, ...updated });
}
