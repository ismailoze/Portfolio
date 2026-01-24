// Auth Models
export interface LoginDto {
  email: string;
  password: string;
  turnstileToken?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshTokenDto {
  token: string;
  refreshToken: string;
}

export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

// Project Models
export interface ProjectTranslation {
  id: string;
  projectId: string;
  languageCode: string;
  title: string;
  description: string;
  technologies?: string;
}

export interface Project {
  id: string;
  title?: string; // Deprecated: Use translations
  description?: string; // Deprecated: Use translations
  technologies?: string; // Deprecated: Use translations
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
  translations?: ProjectTranslation[];
}

export interface CreateProjectTranslationDto {
  languageCode: string;
  title: string;
  description: string;
  technologies?: string;
}

export interface UpdateProjectTranslationDto {
  languageCode: string;
  title: string;
  description: string;
  technologies?: string;
}

export interface CreateProjectDto {
  translations: CreateProjectTranslationDto[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isPublished?: boolean;
  displayOrder?: number;
}

export interface UpdateProjectDto {
  translations: UpdateProjectTranslationDto[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isPublished: boolean;
  displayOrder: number;
}

// Blog Models
export interface BlogPostTranslation {
  id: string;
  blogPostId: string;
  languageCode: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title?: string; // Deprecated: Use translations
  content?: string; // Deprecated: Use translations
  excerpt?: string; // Deprecated: Use translations
  slug?: string; // Deprecated: Use translations
  publishedAt?: string;
  isPublished: boolean;
  featuredImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  translations?: BlogPostTranslation[];
}

export interface CreateBlogPostTranslationDto {
  languageCode: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}

export interface UpdateBlogPostTranslationDto {
  languageCode: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}

export interface CreateBlogPostDto {
  translations: CreateBlogPostTranslationDto[];
  publishedAt?: string;
  isPublished?: boolean;
  featuredImageUrl?: string;
}

export interface UpdateBlogPostDto {
  translations: UpdateBlogPostTranslationDto[];
  publishedAt?: string;
  isPublished: boolean;
  featuredImageUrl?: string;
}

// Experience Models
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string;
  isCurrent: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWorkExperienceDto {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string;
  isCurrent?: boolean;
  displayOrder?: number;
}

export interface UpdateWorkExperienceDto {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string;
  isCurrent: boolean;
  displayOrder: number;
}

// Education Models
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCompleted: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEducationDto {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCompleted?: boolean;
  displayOrder?: number;
}

export interface UpdateEducationDto {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCompleted: boolean;
  displayOrder: number;
}

// Skill Models
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSkillDto {
  name: string;
  category: string;
  level: number;
  icon?: string;
  displayOrder?: number;
}

export interface UpdateSkillDto {
  name: string;
  category: string;
  level: number;
  icon?: string;
  displayOrder: number;
}

// Contact Models
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface CreateContactMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken?: string;
}

export interface ReplyContactMessageDto {
  replyMessage: string;
}

// API Error Response
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Portfolio Owner Model
export interface PortfolioOwner {
  firstName?: string;
  lastName?: string;
}

// Admin Dashboard Stats
export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  unreadMessages: number;
  totalMessages: number;
}
