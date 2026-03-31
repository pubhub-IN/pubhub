import { Router } from "express";
import { listUsers } from "../../controllers/user/userController.js";
import { asyncHandler } from "../../middleware/common/asyncHandler.js";

const usersRoutes = Router();

usersRoutes.get("/users", asyncHandler(listUsers));

export { usersRoutes };
