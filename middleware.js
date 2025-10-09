// middleware.js
import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes (login, register, etc.)
  // if (
  //   pathname.startsWith("/api/auth") ||
  //   pathname.startsWith("/api/otp") ||
  //   pathname.startsWith("/api/userinformation") ||
  //   pathname.startsWith("/api/roles") ||
  //   pathname.startsWith("/api/employees") ||
  //   pathname.startsWith("/api/register-driver") ||
  //   pathname.startsWith("/api/users")
  // ) {
  //   return NextResponse.next();
  // }

  // 🔒 Commented out: Authorization and JWT validation
  /*
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-username", payload.username);
    requestHeaders.set("x-company-id", payload.companyid || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
  */

  // ✅ Allow all requests to pass
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
