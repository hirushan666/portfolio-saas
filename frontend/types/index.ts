// types/index.ts

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  githubUsername: string | null;
  githubId: string | null;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  portfolioNumber: number;
  title: string;
  bio: string | null;
  theme: string;
  published: boolean;
  data: PortfolioData | null;
  viewCount: number;
  projects: Project[];
  user: {
    id: string;
    name: string | null;
    githubUsername: string | null;
    image: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioData {
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  contact?: {
    email?: string;
    location?: string;
    availability?: string;
  };
}

export interface Project {
  id: string;
  portfolioId: string;
  title: string;
  description: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  image: string | null;
  featured: boolean;
  displayOrder: number;
  stars: number | null;
  forks: number | null;
  language: string | null;
  createdAt: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
}

export interface CreatePortfolioRequest {
  userId: string;
  title: string;
  bio?: string;
  theme?: string;
  data?: PortfolioData;
}

export interface CreateProjectRequest {
  portfolioId: string;
  title: string;
  description?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured?: boolean;
  displayOrder?: number;
  stars?: number;
  forks?: number;
  language?: string;
}