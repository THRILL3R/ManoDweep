import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    emotion, feelingColor, bodyLocation, intensity, texture,
    stayWithFeeling, stayActivity,
    divingText, divingTags,
    controlCheck, controlText,
    responses,
    closure,
  } = body;

  const awardCoins = closure === "settled" || closure === "processing";

  const entry = await prisma.lighthouseEntry.create({
    data: {
      userId: session.user.id,
      emotion, feelingColor, bodyLocation,
      intensity: intensity ?? null,
      texture, stayWithFeeling, stayActivity,
      divingText, divingTags, controlCheck, controlText,
      responses, closure,
      coinsAwarded: awardCoins,
    },
  });

  if (awardCoins) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coinBalance: { increment: 20 } },
    });
  }

  return NextResponse.json({ success: true, id: entry.id, coinsAwarded: awardCoins });
}
