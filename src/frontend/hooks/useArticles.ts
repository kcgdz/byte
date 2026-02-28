import { useState, useEffect, useCallback } from 'react';
import type { Article } from '../../shared/types.js';
import * as api from '../api/client.js';

interface UseArticlesOptions {
  page?: number;
  limit?: number;
  category?: string;
}

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => void;
}

export function useArticles(options: UseArticlesOptions = {}): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseArticlesResult['pagination']>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.getArticles(options);

    if (response.success && response.data) {
      setArticles(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } else {
      setError(response.error || 'Failed to fetch articles');
    }

    setLoading(false);
  }, [options.page, options.limit, options.category]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, pagination, refetch: fetchArticles };
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError(null);

      const response = await api.getArticleBySlug(slug);

      if (response.success && response.data) {
        setArticle(response.data);
      } else {
        setError(response.error || 'Article not found');
      }

      setLoading(false);
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, error };
}

export function useTrendingArticles(limit: number = 10) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      const response = await api.getTrendingArticles(limit);

      if (response.success && response.data) {
        setArticles(response.data);
      } else {
        setError(response.error || 'Failed to fetch trending');
      }

      setLoading(false);
    }

    fetchTrending();
  }, [limit]);

  return { articles, loading, error };
}
