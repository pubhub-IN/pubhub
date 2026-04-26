import { Router } from "express";
import {
  githubCallback,
  logout,
  refreshAccessToken,
  skipGithubAuth,
  startGithubAuth,
} from "../../controllers/auth/authController.js";
import { authenticateJWT, optionalAuthenticateJWT } from "../../middleware/auth/authMiddleware.js";
import { asyncHandler } from "../../middleware/common/asyncHandler.js";

const authRoutes = Router();

authRoutes.get("/github", asyncHandler(startGithubAuth));
authRoutes.get("/github/callback", asyncHandler(githubCallback));
authRoutes.get("/logout", optionalAuthenticateJWT, asyncHandler(logout));
authRoutes.post("/logout", optionalAuthenticateJWT, asyncHandler(logout));
authRoutes.post("/skip", asyncHandler(skipGithubAuth));

authRoutes.post("/refresh-token", authenticateJWT, asyncHandler(refreshAccessToken));

export { authRoutes };
