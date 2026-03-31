import { Router } from "express";
import {
  acceptConnectionRequest,
  createConnectionRequest,
  getConnectionStatus,
  listConnectionRequests,
  listConnections,
  rejectConnectionRequest,
  removeConnection,
} from "../../controllers/connections/connectionsController.js";
import { authenticateJWT } from "../../middleware/auth/authMiddleware.js";
import { asyncHandler } from "../../middleware/common/asyncHandler.js";

const connectionRoutes = Router();

connectionRoutes.get("/connections", authenticateJWT, asyncHandler(listConnections));
connectionRoutes.get("/connections/requests", authenticateJWT, asyncHandler(listConnectionRequests));
connectionRoutes.get("/connections/status/:username", authenticateJWT, asyncHandler(getConnectionStatus));

connectionRoutes.post("/connections/request", authenticateJWT, asyncHandler(createConnectionRequest));
connectionRoutes.put("/connections/accept/:requestId", authenticateJWT, asyncHandler(acceptConnectionRequest));
connectionRoutes.put("/connections/reject/:requestId", authenticateJWT, asyncHandler(rejectConnectionRequest));
connectionRoutes.delete("/connections/:connectionId", authenticateJWT, asyncHandler(removeConnection));

connectionRoutes.get("/connection-requests", authenticateJWT, asyncHandler(listConnectionRequests));
connectionRoutes.post("/connection-requests", authenticateJWT, asyncHandler(createConnectionRequest));
connectionRoutes.put("/connection-requests/:requestId/accept", authenticateJWT, asyncHandler(acceptConnectionRequest));
connectionRoutes.put("/connection-requests/:requestId/reject", authenticateJWT, asyncHandler(rejectConnectionRequest));

export { connectionRoutes };
