import { User } from "../../models/user/userModel.js";
import { extractBearerToken, verifyAccessToken } from "./tokenUtils.js";

export async function authenticateJWT(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;
    req.tokenClaims = decoded;
    return next();
  } catch {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

export async function optionalAuthenticateJWT(req, _res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user;
      req.tokenClaims = decoded;
    }
  } catch {
    // Intentionally ignore token parse failures for optional auth.
  }

  return next();
}
