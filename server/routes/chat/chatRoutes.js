import { Router } from "express";
import { aiChatFallback, createChatMessage, getChatMessages } from "../../controllers/chat/chatController.js";
import { authenticateJWT } from "../../middleware/auth/authMiddleware.js";
import { asyncHandler } from "../../middleware/common/asyncHandler.js";

const chatRoutes = Router();

chatRoutes.post("/chat-messages", authenticateJWT, asyncHandler(createChatMessage));
chatRoutes.get("/chat-messages/:sessionId", authenticateJWT, asyncHandler(getChatMessages));
chatRoutes.post("/ai-chat", authenticateJWT, asyncHandler(aiChatFallback));

export { chatRoutes };
