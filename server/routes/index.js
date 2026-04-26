import { Router } from "express";
import { authRoutes } from "./auth/authRoutes.js";
import { chatRoutes } from "./chat/chatRoutes.js";
import { connectionRoutes } from "./connections/connectionRoutes.js";
import { hackathonRoutes } from "./hackathons/hackathonRoutes.js";
import { repositoryRoutes } from "./repositories/repositoryRoutes.js";
import { userRoutes } from "./user/userRoutes.js";
import { usersRoutes } from "./users/usersRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/api/user", repositoryRoutes);
router.use("/api/user", userRoutes);
router.use("/api/hackathons", hackathonRoutes);
router.use("/api", connectionRoutes);
router.use("/api", usersRoutes);
router.use("/api", chatRoutes);

export { router };
