// Shared types for frontend and backend

export interface Author {
  id: string;
  name: string;
  bio?: string;
  role?: string;
  avatar_url?: string;
  article_count?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  key_points: string[];
  category: string;
  tags: string[];
  author_id: string;
  author?: Author;
  source_url?: string;
  source_name?: string;
  image_url?: string;
  read_time: number;
  word_count: number;
  rpm_score: number;
  views: number;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string;
  priority: number;
  is_active: boolean;
  last_fetched_at?: string;
  created_at: string;
}

export interface Trend {
  id: string;
  keyword: string;
  source: 'google' | 'reddit' | 'twitter';
  score: number;
  category?: string;
  processed: boolean;
  detected_at: string;
}

export interface PerformanceDaily {
  id: string;
  date: string;
  category: string;
  article_count: number;
  total_views: number;
  estimated_revenue: number;
  avg_rpm: number;
}

export interface ProcessedUrl {
  url_hash: string;
  url: string;
  processed_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// AI Generation types
export interface AiEvaluationResult {
  should_publish: boolean;
  category: string;
  evergreen_score: number;
  estimated_rpm: number;
  reason: string;
}

export interface AiGenerationResult {
  title: string;
  slug: string;
  excerpt: string;
  key_points: string[];
  content: string;
  tags: string[];
  read_time: number;
}

// Queue Job types
export interface TrendJobData {
  source: 'google' | 'reddit' | 'twitter';
}

export interface ArticleJobData {
  source_url: string;
  source_name: string;
  source_content: string;
  category: string;
  priority: number;
}

// Categories with RPM scores
export const CATEGORIES = {
  technology: { name: 'Technology', rpm: 6 },
  finance: { name: 'Finance', rpm: 10 },
  health: { name: 'Health', rpm: 7 },
  sports: { name: 'Sports', rpm: 3 },
  entertainment: { name: 'Entertainment', rpm: 2 },
  science: { name: 'Science', rpm: 5 },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
