import { Connection } from "../../models/connections/connectionModel.js";
import { User } from "../../models/user/userModel.js";

async function getUserByUsername(username) {
  return User.findOne({ github_username: username });
}

export async function getConnectionStatus(req, res) {
  const currentUser = req.user;
  const targetUser = await getUserByUsername(req.params.username);

  if (!targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  if (currentUser.id === targetUser.id) {
    return res.json({ status: "self", message: "This is your own profile" });
  }

  const accepted = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: currentUser._id, recipient: targetUser._id },
      { requester: targetUser._id, recipient: currentUser._id },
    ],
  });

  if (accepted) {
    return res.json({ status: "connected", message: "You are connected" });
  }

  const sentRequest = await Connection.findOne({
    requester: currentUser._id,
    recipient: targetUser._id,
    status: "pending",
  });
  if (sentRequest) {
    return res.json({ status: "request_sent", requestStatus: "pending", message: "Request sent" });
  }

  const receivedRequest = await Connection.findOne({
    requester: targetUser._id,
    recipient: currentUser._id,
    status: "pending",
  });
  if (receivedRequest) {
    return res.json({
      status: "request_received",
      requestStatus: "pending",
      requestId: receivedRequest.id,
      message: "Request received",
    });
  }

  return res.json({ status: "not_connected", message: "No connection yet" });
}

export async function createConnectionRequest(req, res) {
  const recipientUsername = req.body.recipient_username;
  if (!recipientUsername) {
    return res.status(400).json({ error: "recipient_username is required" });
  }

  const recipient = await getUserByUsername(recipientUsername);
  if (!recipient) {
    return res.status(404).json({ error: "Recipient user not found" });
  }

  if (recipient.id === req.user.id) {
    return res.status(400).json({ error: "You cannot connect with yourself" });
  }

  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: recipient._id },
      { requester: recipient._id, recipient: req.user._id },
    ],
  });

  if (existing && existing.status === "accepted") {
    return res.status(409).json({ error: "You are already connected" });
  }

  if (existing && existing.status === "pending") {
    return res.status(409).json({ error: "A pending request already exists" });
  }

  const request = existing
    ? await Connection.findByIdAndUpdate(
        existing._id,
        {
          $set: {
            requester: req.user._id,
            recipient: recipient._id,
            status: "pending",
            message: req.body.message || "",
          },
        },
        { new: true }
      )
    : await Connection.create({
        requester: req.user._id,
        recipient: recipient._id,
        status: "pending",
        message: req.body.message || "",
      });

  return res.status(201).json({ success: true, request });
}

export async function listConnectionRequests(req, res) {
  const [received, sent] = await Promise.all([
    Connection.find({ recipient: req.user._id, status: "pending" })
      .populate("requester", "github_username name avatar_url profession")
      .sort({ createdAt: -1 }),
    Connection.find({ requester: req.user._id, status: "pending" })
      .populate("recipient", "github_username name avatar_url profession")
      .sort({ createdAt: -1 }),
  ]);

  return res.json({ success: true, requests: { received, sent } });
}

export async function listConnections(req, res) {
  const connections = await Connection.find({
    status: "accepted",
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
  })
    .populate("requester", "github_username name avatar_url profession")
    .populate("recipient", "github_username name avatar_url profession")
    .sort({ updatedAt: -1 });

  const normalized = connections.map((entry) => {
    const otherUser = String(entry.requester._id) === req.user.id ? entry.recipient : entry.requester;
    return {
      id: entry.id,
      connected_at: entry.updatedAt,
      user: otherUser,
    };
  });

  return res.json({ success: true, connections: normalized });
}

export async function acceptConnectionRequest(req, res) {
  const request = await Connection.findOne({
    _id: req.params.requestId,
    recipient: req.user._id,
    status: "pending",
  });

  if (!request) {
    return res.status(404).json({ error: "Connection request not found" });
  }

  request.status = "accepted";
  await request.save();

  return res.json({ success: true, request });
}

export async function rejectConnectionRequest(req, res) {
  const request = await Connection.findOne({
    _id: req.params.requestId,
    recipient: req.user._id,
    status: "pending",
  });

  if (!request) {
    return res.status(404).json({ error: "Connection request not found" });
  }

  request.status = "rejected";
  await request.save();

  return res.json({ success: true, request });
}

export async function removeConnection(req, res) {
  const connection = await Connection.findOne({
    _id: req.params.connectionId,
    status: "accepted",
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
  });

  if (!connection) {
    return res.status(404).json({ error: "Connection not found" });
  }

  await connection.deleteOne();
  return res.json({ success: true });
}
