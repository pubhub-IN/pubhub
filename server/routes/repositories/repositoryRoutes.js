import { Router } from "express";
import {
  getCurrentUserActiveDays,
  getGroupedRepositoriesByTechnology,
  getOwnRepositories,
  getUserActiveDaysByUsername,
  getUserRepoCountByUsername,
  getUserRepositoriesByUsername,
} from "../../controllers/repositories/repositoryController.js";
import { authenticateJWT } from "../../middleware/auth/authMiddleware.js";
import { asyncHandler } from "../../middleware/common/asyncHandler.js";

const repositoryRoutes = Router();

repositoryRoutes.get("/own-repositories", authenticateJWT, asyncHandler(getOwnRepositories));
repositoryRoutes.get("/active-days", authenticateJWT, asyncHandler(getCurrentUserActiveDays));
repositoryRoutes.get("/repositories", authenticateJWT, asyncHandler(getGroupedRepositoriesByTechnology));

repositoryRoutes.get("/:username/repo-count", asyncHandler(getUserRepoCountByUsername));
repositoryRoutes.get("/:username/active-days", asyncHandler(getUserActiveDaysByUsername));
repositoryRoutes.get("/:username/repositories", asyncHandler(getUserRepositoriesByUsername));

export { repositoryRoutes };
