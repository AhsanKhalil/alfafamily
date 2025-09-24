// lib/auth.js
import { jwtVerify } from "jose";

export const verifyToken = async (token) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return null;
  }
};

// Middleware helper for routes
export const authMiddleware = async (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  return await verifyToken(token);
};
