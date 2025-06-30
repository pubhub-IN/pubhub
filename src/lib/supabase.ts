import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "http://localhost";
const supabaseAnonKey = "local-anon-key";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  github_data: any;
  access_token?: string;
  created_at: string;
  updated_at: string;
};