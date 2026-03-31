const sessionMessages = new Map();

function buildMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createChatMessage(req, res) {
  const { session_id, content, role } = req.body;

  if (!session_id || !content || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const key = `${req.user.id}:${session_id}`;
  const existing = sessionMessages.get(key) || [];
  const message = {
    id: buildMessageId(),
    user_id: req.user.id,
    session_id,
    content,
    role,
    created_at: new Date().toISOString(),
  };

  existing.push(message);
  sessionMessages.set(key, existing);

  return res.status(201).json(message);
}

export async function getChatMessages(req, res) {
  const key = `${req.user.id}:${req.params.sessionId}`;
  const messages = sessionMessages.get(key) || [];
  return res.json(messages);
}

export async function aiChatFallback(req, res) {
  const { sessionId, messages } = req.body;
  const userMessages = Array.isArray(messages) ? messages.filter((message) => message.role === "user") : [];
  const lastUserPrompt = userMessages[userMessages.length - 1]?.content || "";
  const fallbackResponse = `MongoDB migration mode is active. I received your prompt: ${lastUserPrompt.slice(0, 280)}`;

  if (sessionId) {
    const key = `${req.user.id}:${sessionId}`;
    const existing = sessionMessages.get(key) || [];

    existing.push({
      id: buildMessageId(),
      user_id: req.user.id,
      session_id: sessionId,
      role: "assistant",
      content: fallbackResponse,
      created_at: new Date().toISOString(),
    });

    sessionMessages.set(key, existing);
  }

  return res.json({ response: fallbackResponse });
}
