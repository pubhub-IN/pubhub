export type User = {
  id: string;
  github_id: number;
  github_username: string;
  avatar_url?: string;
  email?: string;
  name?: string;
  total_commits: number;
  languages: Record<string, number>;
  technologies: string[];
  github_data: unknown;
  access_token?: string;
  created_at: string;
  updated_at: string;
};