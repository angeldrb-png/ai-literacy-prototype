import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chatLogSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const turn = await prisma.aIChatTurn.create({
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, turn });
  } catch (error) {
    console.error("POST /api/chat/log failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to save chat turn" }, { status: 500 });
  }
}
