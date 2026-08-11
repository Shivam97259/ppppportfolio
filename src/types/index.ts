export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface ProfileData {
  // Header & Branding
  brandName: string;
  logoText: string;
  brandIconUrl?: string;
  brandFaviconUrl?: string;
  navHomeLabel: string;
  navAboutLabel: string;
  navProjectsLabel: string;
  navCertsLabel: string;
  navContactLabel: string;

  // Personal & Hero Section
  name: string;
  title: string;
  headline: string;
  subheadline: string;
  tagline: string;
  bio: string;
  aboutBio: string;
  profileImageUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;

  // Contact & Socials
  location: string;
  email: string;
  phone: string;
  responseExpectation: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  leetcodeUrl: string;
  hacktheboxUrl: string;

  // Counter Statistics
  yearsExperience: number;
  completedProjects: number;
  certificationsCount: number;
  uptimePercentage: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number; // 0 to 100
  iconName: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  longDescription: string;
  keyFeatures?: string[];
  technologies: string[];
  featured: boolean;
  demoUrl: string;
  githubUrl: string;
  imageUrl: string;
  completedDate: string;
  stars: number;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skillsCovered: string[];
  icon: string;
  badgeImageUrl?: string;
  certificateImageUrl?: string;
  verified: boolean;
  category?: string;
  expirationDate?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export type PageView = 'home' | 'about' | 'projects' | 'certifications' | 'contact';
