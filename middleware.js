import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public APIs (login, register, otp, etc.)
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/otp")
  || pathname.startsWith("/api/companies") || pathname.startsWith("/api/vehicles")
  ) {
    return NextResponse.next();
  }

  // Get token from headers
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Attach user data to request
  req.user = decoded;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // protect all APIs
};
