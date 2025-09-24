// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Do NOT verify JWT here, only block if no header
  const url = req.nextUrl.pathname;

  if (url.startsWith("/api") && !url.includes("/auth/")) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
