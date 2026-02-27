// types/portfolio-builder.ts

export interface PortfolioBuilderState {
  // Step 1: Basic Info
  title: string;
  name: string;
  bio: string;
  avatarSource: "github" | "upload";
  avatarUploadUrl?: string; // If they uploaded an image

  // Step 2: Projects
  projects: BuilderProject[];

  // Step 3: Theme
  theme: "minimal" | "midnight" | "vibrant";
}

export interface BuilderProject {
  id: string; // Temporary UUID for frontend tracking
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  isGithubImport: boolean;
  stars?: number;
  forks?: number;
  language?: string;
}
