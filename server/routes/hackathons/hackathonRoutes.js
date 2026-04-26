import express from "express";
import { getHackathons } from "../../controllers/hackathons/hackathonController.js";

const router = express.Router();

router.get("/", getHackathons);

export { router as hackathonRoutes };