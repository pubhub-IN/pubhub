import { Router } from "express";
import { refreshAccessToken } from "../../controllers/auth/authController.js";
import {
  getCurrentUser,
  getPublicUser,
  sessionStatus,
  updateProfession,
  updateSocialLinks,
  updateTechnologies,
} from "../../controllers/user/userController.js";
import { authenticateJWT, optionalAuthenticateJWT } from "../../middleware/auth/authMiddleware.js";
import { asyncHandler } from "../../middleware/common/asyncHandler.js";

const userRoutes = Router();

userRoutes.get("/", authenticateJWT, asyncHandler(getCurrentUser));
userRoutes.post("/refresh-token", optionalAuthenticateJWT, asyncHandler(refreshAccessToken));
userRoutes.get("/session-status", authenticateJWT, asyncHandler(sessionStatus));
userRoutes.put("/technologies", authenticateJWT, asyncHandler(updateTechnologies));
userRoutes.put("/profession", authenticateJWT, asyncHandler(updateProfession));
userRoutes.put("/social-links", authenticateJWT, asyncHandler(updateSocialLinks));

userRoutes.get("/:username", asyncHandler(getPublicUser));

export { userRoutes };
