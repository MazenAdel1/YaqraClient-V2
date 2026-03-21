import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "token";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value ?? null;
  return NextResponse.json({ token });
}

export async function POST(request: NextRequest) {
  const { token } = (await request.json()) as { token?: string };

  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_KEY, token, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(TOKEN_KEY);

  return response;
}
