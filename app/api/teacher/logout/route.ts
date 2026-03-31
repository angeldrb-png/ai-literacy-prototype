import { NextResponse } from "next/server";
import { clearTeacherAuthCookie } from "@/lib/teacher-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearTeacherAuthCookie(response);
}
