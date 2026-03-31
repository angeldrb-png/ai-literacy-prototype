import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionStartSchema } from "@/lib/schemas";

function makeSessionCode() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `S-${y}${m}${d}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = sessionStartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const session = await prisma.studentSession.create({
      data: {
        sessionCode: makeSessionCode(),
        language: parsed.data.language,
        deviceType: parsed.data.deviceType,
        regionNote: parsed.data.regionNote,
        currentWorld: "home",
        currentStep: "home",
        status: "in_progress",
        studentName: parsed.data.studentName,
        studentCode: parsed.data.studentCode,
        className: parsed.data.className,
        schoolName: parsed.data.schoolName,
        gradeLevel: parsed.data.gradeLevel,
      },
    });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("POST /api/session/start failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to start session" }, { status: 500 });
  }
}
