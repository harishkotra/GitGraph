export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null; // Primary language
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  html_url: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

export enum SkillCategory {
  LANGUAGE = 'Language',
  FRAMEWORK = 'Framework',
  TOOL = 'Tool',
  DATABASE = 'Database',
  PLATFORM = 'Platform',
}

export interface Skill {
  name: string;
  category: SkillCategory;
  usageScore: number; // 0-100, relative frequency/importance
  hexColor?: string; // Optional color for UI
}

export interface DeveloperProfile {
  summary: string;
  archetype: string; // e.g. "Frontend Wizard", "DevOps Engineer"
  skills: Skill[];
  topLanguages: { name: string; percentage: number }[];
}

export type AppState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
