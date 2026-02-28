import type { Article, ApiResponse } from '../../shared/types.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Articles API
export async function getArticles(options: {
  page?: number;
  limit?: number;
  category?: string;
} = {}): Promise<ApiResponse<Article[]>> {
  const params = new URLSearchParams();
  if (options.page) params.set('page', options.page.toString());
  if (options.limit) params.set('limit', options.limit.toString());
  if (options.category) params.set('category', options.category);

  return fetchApi(`/api/articles?${params}`);
}

export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  return fetchApi(`/api/articles/${slug}`);
}

export async function getTrendingArticles(limit: number = 10): Promise<ApiResponse<Article[]>> {
  return fetchApi(`/api/articles/trending?limit=${limit}`);
}

export async function getCategoryArticles(
  categoryId: string,
  options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<Article[]>> {
  const params = new URLSearchParams();
  if (options.page) params.set('page', options.page.toString());
  if (options.limit) params.set('limit', options.limit.toString());

  return fetchApi(`/api/categories/${categoryId}/articles?${params}`);
}

export async function getCategories(): Promise<ApiResponse<{ id: string; name: string; rpm: number }[]>> {
  return fetchApi('/api/categories');
}
