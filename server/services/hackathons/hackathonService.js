const DEVPOST_API = "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open";
const HACK2SKILL_API = "https://vision.hack2skill.com/api/v1/innovator/public/event/public-list?records=9&mode=VIRTUAL&search=&start=2026-01-31T18:30:00.000Z&end=2026-12-30T18:30:00.000Z&ticket=FREE";
const EVENTBRITE_API = "https://www.eventbrite.com/api/v3/destination/events/?event_ids=1965623568005,1987302852328,1987335109811,1977478370037,1986269038162,1808531599699,1810741288939,1985707123460,1811023874159,1807768296639,1735265418579,1829195696569,1984861061867,1810992199419,1986927881781,472574492027,1983349065445,1806905255259,1984030278973,1986983959511&page_size=20&expand=event_sales_status,image,primary_venue,saves,ticket_availability,primary_organizer,primary_organizer.image,public_collections";

function daysUntil(dateString) {
  if (!dateString) return null;
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) return null;
  
  const diff = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

function extractNumber(str) {
  if (!str) return 0;
  const match = String(str).match(/\d+/g);
  return match ? parseInt(match.join(""), 10) : 0;
}

function cleanHtml(str) {
  if (!str) return "";
  return str.replace(/<[^>]+>/g, "").trim();
}

async function fetchDevpostHackathons() {
  const allHackathons = [];
  const maxPages = 5;
  
  try {
    for (let page = 1; page <= maxPages; page++) {
      const apiUrl = `${DEVPOST_API}&page=${page}`;
      console.log(`Fetching Devpost page ${page}...`);
      
      const res = await fetch(apiUrl, {
          headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              "Accept": "application/json"
          }
      });
      
      if (!res.ok) {
        console.warn(`Devpost API page ${page} failed: ${res.status}`);
        break;
      }
      
      const data = await res.json();
      const hackathons = data.hackathons || [];
      
      if (hackathons.length === 0) {
        console.log(`Devpost page ${page} returned no results, stopping pagination.`);
        break;
      }
      
      const normalizedHackathons = hackathons.map((h) => {
        // time_left_to_submission e.g., "13 days left"
        let days = extractNumber(h.time_left_to_submission);
        
        const prizeAmount = h.prize_amount ? cleanHtml(h.prize_amount) : null;
        
        return {
          id: `devpost-${h.id}`,
          sourceId: String(h.id),
          sourceName: "Devpost",
          title: h.title,
          url: h.url,
          location: h.displayed_location?.location || "Online",
          bannerUrl: h.thumbnail_url ? (h.thumbnail_url.startsWith("//") ? "https:" + h.thumbnail_url : h.thumbnail_url) : null,
          themes: (h.themes || []).map((t) => t.name),
          prizeAmount,
          registrationsCount: h.registrations_count || 0,
          dateLabel: h.submission_period_dates || null,
          daysUntilStart: days > 0 ? days : null,
          daysUntilEnd: null,
        };
      });
      
      allHackathons.push(...normalizedHackathons);
      console.log(`Devpost page ${page} fetched successfully. Total so far: ${allHackathons.length}`);
    }
    
    console.log(`Finished fetching Devpost. Total hackathons: ${allHackathons.length}`);
    return allHackathons;
  } catch (error) {
    console.error("Devpost error:", error);
    return allHackathons;
  }
}

async function fetchHack2SkillHackathons() {
  try {
    const res = await fetch(HACK2SKILL_API, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "application/json"
        }
    });
    if (!res.ok) throw new Error(`Hack2Skill API failed: ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    
    return data.map((h) => {
      const daysToStart = daysUntil(h.submissionStart || h.registrationStart);
      const daysToEnd = daysUntil(h.submissionEnd || h.registrationEnd);
      
      const start = h.registrationStart ? new Date(h.registrationStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      const end = h.registrationEnd ? new Date(h.registrationEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      
      return {
        id: `h2s-${h._id}`,
        sourceId: String(h._id),
        sourceName: "Hack2Skill",
        title: h.title,
        url: `https://hack2skill.com/hack/${h.eventUrl}`,
        location: h.mode || "Virtual",
        bannerUrl: h.thumbnail || null,
        themes: h.participation ? [h.participation, h.flag].filter(Boolean) : [],
        prizeAmount: h.ticket === "FREE" ? "Free" : null,
        registrationsCount: 0,
        dateLabel: `${start} - ${end}`,
        daysUntilStart: daysToStart,
        daysUntilEnd: daysToEnd,
      };
    });
  } catch (error) {
    console.error("Hack2Skill error:", error);
    return [];
  }
}

async function fetchEventbriteHackathons() {
  try {
    const res = await fetch(EVENTBRITE_API, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "application/json"
        }
    });
    if (!res.ok) throw new Error(`Eventbrite API failed: ${res.status}`);
    const json = await res.json();
    const events = json.events || [];
    
    return events.map((e) => {
      // Parse start date/time
      const startDateStr = e.start_date; // "2026-04-23"
      const startTimeStr = e.start_time; // "09:00"
      const dateTimeStr = startDateStr && startTimeStr ? `${startDateStr}T${startTimeStr}:00` : null;
      const startDate = dateTimeStr ? new Date(dateTimeStr) : null;
      
      const daysToStart = startDate ? daysUntil(startDate.toISOString()) : null;
      
      // Format date display
      const startFormatted = startDate ? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA";
      const timeFormatted = startDate ? startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: e.timezone || "UTC" }) : "";
      
      const dateLabel = `${startFormatted} • ${timeFormatted} ${e.timezone ? e.timezone.split("/")[1] : ""}`;
      
      // Location - check if online or has venue
      const location = e.is_online_event ? "Online" : e.primary_venue ? `${e.primary_venue.name || "TBA"}` : "Online";
      
      // Banner image
      const bannerUrl = e.image?.url || null;
      
      // Extract themes from tags
      const themes = (e.tags || [])
        .filter(tag => tag.prefix === "OrganizerTag" && tag.display_name)
        .map(tag => tag.display_name)
        .slice(0, 5); // Limit to 5 themes
      
      // Price info
      const prizeAmount = e.ticket_availability?.is_free ? "Free" : null;
      
      return {
        id: `eventbrite-${e.id}`,
        sourceId: String(e.id),
        sourceName: "Eventbrite",
        title: e.name || "Untitled Event",
        url: e.url,
        location,
        bannerUrl,
        themes,
        prizeAmount,
        registrationsCount: 0,
        dateLabel,
        daysUntilStart: daysToStart,
        daysUntilEnd: null,
      };
    });
  } catch (error) {
    console.error("Eventbrite error:", error);
    return [];
  }
}

export async function getHackathonFeed() {
  const [devpost, hack2skill, eventbrite] = await Promise.all([
    fetchDevpostHackathons(),
    fetchHack2SkillHackathons(),
    fetchEventbriteHackathons()
  ]);

  const allHackathons = [...devpost, ...hack2skill, ...eventbrite];
  
  // Basic categorization
  return {
    success: true,
    generatedAt: new Date().toISOString(),
    latest: {
      title: "Latest Global Hackathons",
      description: "Recently added competitions across all platforms.",
      kind: "latest",
      total: allHackathons.length,
      items: allHackathons.slice(0, 12),
    },
    upcoming: {
      title: "Upcoming Deadlines",
      description: "Hackathons ending soon. Register while you can!",
      kind: "upcoming",
      total: allHackathons.length,
      items: [...allHackathons].sort((a, b) => (a.daysUntilStart || 999) - (b.daysUntilStart || 999)).slice(0, 12),
    }
  };
}