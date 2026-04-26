export interface HackathonFeedItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  location: string | null;
  bannerUrl: string | null;
  themes: string[];
  prizeAmount: string | null;
  registrationsCount: number;
  dateLabel: string | null;
  daysUntilStart: number | null;
  daysUntilEnd: number | null;
}

export interface HackathonFeedSection {
  title: string;
  description: string;
  kind: "latest" | "upcoming" | "recommended";
  total: number;
  items: HackathonFeedItem[];
}

export interface HackathonFeedResponse {
  success: boolean;
  generatedAt: string;
  latest: HackathonFeedSection;
  upcoming: HackathonFeedSection;
}