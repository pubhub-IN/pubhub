export async function getHackathons(req, res) {
  try {
    const { getHackathonFeed } = await import("../../services/hackathons/hackathonService.js");
    const feed = await getHackathonFeed();
    return res.json(feed);
  } catch (error) {
    console.error("Hackathon controller error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch hackathons" });
  }
}