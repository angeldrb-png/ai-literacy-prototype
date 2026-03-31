import { NextRequest, NextResponse } from "next/server";
import { attachTeacherAuthCookie, teacherAuthConfigured, verifyTeacherCredentials } from "@/lib/teacher-auth";

export async function POST(request: NextRequest) {
  try {
    if (!teacherAuthConfigured()) {
      return NextResponse.json({ ok: false, error: "Teacher login is not configured." }, { status: 500 });
    }
    const body = await request.json();
    const username = String(body?.username ?? "");
    const password = String(body?.password ?? "");
    if (!verifyTeacherCredentials(username, password)) {
      return NextResponse.json({ ok: false, error: "Invalid teacher credentials." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    return attachTeacherAuthCookie(response);
  } catch (error) {
    console.error("POST /api/teacher/login failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to sign in." }, { status: 500 });
  }
}
