import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const TEACHER_AUTH_COOKIE = "teacher_auth";

function getUsername() {
  return process.env.TEACHER_LOGIN_USERNAME ?? "";
}

function getPassword() {
  return process.env.TEACHER_LOGIN_PASSWORD ?? "";
}

export function teacherAuthConfigured() {
  return Boolean(getUsername() && getPassword());
}

function buildTeacherToken() {
  const username = getUsername();
  const password = getPassword();
  if (!username || !password) return "";
  return crypto.createHash("sha256").update(`${username}::${password}`).digest("hex");
}

export function verifyTeacherCredentials(username: string, password: string) {
  return username === getUsername() && password === getPassword();
}

export async function isTeacherAuthenticated() {
  const store = await cookies();
  const cookie = store.get(TEACHER_AUTH_COOKIE)?.value;
  return Boolean(cookie && cookie === buildTeacherToken());
}

export function isTeacherAuthenticatedFromRequest(request: NextRequest) {
  const cookie = request.cookies.get(TEACHER_AUTH_COOKIE)?.value;
  return Boolean(cookie && cookie === buildTeacherToken());
}

export function attachTeacherAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: TEACHER_AUTH_COOKIE,
    value: buildTeacherToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export function clearTeacherAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: TEACHER_AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return response;
}
