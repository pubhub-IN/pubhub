import { User } from "../../models/user/userModel.js";

export async function getCurrentUser(req, res) {
  return res.json(req.user.toJSON());
}

export async function getPublicUser(req, res) {
  const user = await User.findOne({ github_username: req.params.username }).select("-github_access_token");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user.toJSON());
}

export async function listUsers(_req, res) {
  const users = await User.find({}).select("id github_username name avatar_url profession email").limit(500);
  return res.json(users.map((user) => user.toJSON()));
}

export async function updateTechnologies(req, res) {
  const technologies = Array.isArray(req.body.technologies)
    ? req.body.technologies.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];

  req.user.technologies = technologies;
  req.user.last_active_at = new Date();
  await req.user.save();

  return res.json(req.user.toJSON());
}

export async function updateProfession(req, res) {
  req.user.profession = typeof req.body.profession === "string" ? req.body.profession.trim() : "";
  req.user.last_active_at = new Date();
  await req.user.save();

  return res.json(req.user.toJSON());
}

export async function updateSocialLinks(req, res) {
  if ("linkedin_username" in req.body) {
    req.user.linkedin_username = req.body.linkedin_username || null;
  }

  if ("x_username" in req.body) {
    req.user.x_username = req.body.x_username || null;
  }

  req.user.last_active_at = new Date();
  await req.user.save();

  return res.json(req.user.toJSON());
}

export async function sessionStatus(_req, res) {
  return res.json({ authenticated: true });
}
