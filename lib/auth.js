
import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return null;
  }
};

export const authMiddleware = async (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  return verifyToken(token);
};
