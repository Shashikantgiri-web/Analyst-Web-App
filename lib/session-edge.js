import { jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "app_session";

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
