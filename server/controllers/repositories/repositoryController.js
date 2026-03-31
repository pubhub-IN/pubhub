import { User } from "../../models/user/userModel.js";

function groupRepositoriesByTechnology(repositories = []) {
  const grouped = new Map();

  repositories.forEach((repository) => {
    const technology = repository.language || "Unknown";
    if (!grouped.has(technology)) {
      grouped.set(technology, []);
    }
    grouped.get(technology).push(repository);
  });

  return Array.from(grouped.entries()).map(([technology, repos]) => ({
    technology,
    repositories: repos,
    count: repos.length,
  }));
}

function getActiveDayCount(user) {
  if (Array.isArray(user.activity_days) && user.activity_days.length > 0) {
    return user.activity_days.length;
  }

  const uniqueDays = new Set();
  (user.repositories || []).forEach((repo) => {
    if (repo.pushed_at) {
      uniqueDays.add(new Date(repo.pushed_at).toISOString().slice(0, 10));
    }
  });

  return uniqueDays.size;
}

export async function getOwnRepositories(req, res) {
  return res.json({ repositories: req.user.repositories || [] });
}

export async function getGroupedRepositoriesByTechnology(req, res) {
  const grouped = groupRepositoriesByTechnology(req.user.repositories || []);
  return res.json({ success: true, technologies: grouped, cached: true });
}

export async function getCurrentUserActiveDays(req, res) {
  return res.json({ activeDays: getActiveDayCount(req.user) });
}

export async function getUserRepositoriesByUsername(req, res) {
  const user = await User.findOne({ github_username: req.params.username }).select("repositories");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ repositories: user.repositories || [] });
}

export async function getUserRepoCountByUsername(req, res) {
  const user = await User.findOne({ github_username: req.params.username }).select("total_public_repos repositories");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const repoCount = user.total_public_repos || (user.repositories || []).length;
  return res.json({ repoCount });
}

export async function getUserActiveDaysByUsername(req, res) {
  const user = await User.findOne({ github_username: req.params.username }).select("activity_days repositories");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ activeDays: getActiveDayCount(user) });
}
