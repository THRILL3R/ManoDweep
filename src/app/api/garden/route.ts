import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function todayDate() {
  const d = new Date();
  // Store as midnight UTC for the local calendar date
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const sessionType = url.searchParams.get("session") ?? "morning";

  const entry = await prisma.gardenEntry.findUnique({
    where: {
      userId_date_session: {
        userId: session.user.id,
        date: todayDate(),
        session: sessionType,
      },
    },
  });

  return NextResponse.json(entry ?? null);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    session: sessionType = "morning",
    gratitude,
    intentions,
    goals,
    evening,
    cups,
    completed,
  } = body;

  const data: Record<string, unknown> = {};
  if (gratitude !== undefined) data.gratitude = gratitude;
  if (intentions !== undefined) data.intentions = intentions;
  if (goals !== undefined) data.goals = goals;
  if (evening !== undefined) data.evening = evening;
  if (cups !== undefined) data.cups = cups;
  if (completed !== undefined) data.completed = completed;

  const entry = await prisma.gardenEntry.upsert({
    where: {
      userId_date_session: {
        userId: session.user.id,
        date: todayDate(),
        session: sessionType,
      },
    },
    create: {
      userId: session.user.id,
      date: todayDate(),
      session: sessionType,
      ...data,
    },
    update: data,
  });

  // Award coins on completion (once per session per day)
  if (completed && !entry.coinsAwarded) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { coinBalance: { increment: 20 } },
      }),
      prisma.gardenEntry.update({
        where: { id: entry.id },
        data: { coinsAwarded: true },
      }),
    ]);
  }

  return NextResponse.json({ success: true });
}
