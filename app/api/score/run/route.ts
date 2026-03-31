import { NextRequest, NextResponse } from "next/server";
import { scoreRunSchema } from "@/lib/schemas";
import { scoreSession } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = scoreRunSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const results = await scoreSession(parsed.data.sessionId);

    return NextResponse.json({ ok: true, count: results.length, results });
  } catch (error) {
    console.error("POST /api/score/run failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to score session" }, { status: 500 });
  }
}
