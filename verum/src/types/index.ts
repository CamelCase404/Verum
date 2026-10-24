export type Level = "junior" | "mid" | "senior";
export type Role = "developer" | "company";

export interface User {
  name: string;
  email: string;
  role?: Role;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface GithubData {
  username: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  total_stars: number;
  languages: [string, number][];
  projects: {
    name: string;
    description: string | null;
    url: string;
    language: string | null;
    stars: number;
  }[];
}

export interface Profile {
  github: string;
  comment: string;
  tested: boolean;
  bio: string;
  avatarColor: string;
  avatarImage?: string;
  githubData?: GithubData | null;
  projects: Project[];
  scores: { arch: number; code: number; ai: number; adapt: number } | null;
}

export interface Specialist {
  id: string;
  name: string;
  handle: string;
  level: Level;
  role: string;
  skills: string[];
  scores: { arch: number; code: number; ai: number; adapt: number };
  match: number;
  rating: number;
  reviews: number;
  why: string;
}

export interface Notification {
  id: string;
  t: string;
  d: string;
  time: string;
  unread: boolean;
  ico: string;
}
