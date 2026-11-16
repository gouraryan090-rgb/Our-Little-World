import { NextResponse } from "next/server";
import { getUserFromPassword } from "../../../lib/auth";
import { createSession, SESSION_COOKIE } from "../../../lib/session";

export async function POST(req) {
  const { password } = await req.json();
  const user = getUserFromPassword(password);

  if (!user) {
    return NextResponse.json({ error: "Galat password" }, { status: 401 });
  }

  const token = await createSession(user);
  const res = NextResponse.json({ ok: true, name: user.name });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 din
    path: "/",
  });

  return res;
}