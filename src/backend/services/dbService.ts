import { db } from '../config/database.js';
import type { Article, RssSource, Trend, Author, ProcessedUrl } from '../../shared/types.js';
import crypto from 'crypto';

// Helper to generate URL hash for deduplication
export function generateHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// ============ ARTICLES ============

export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> {
  const result = await db.query<Article>(
    `INSERT INTO articles (slug, title, excerpt, content, key_points, category, tags, author_id, source_url, source_name, image_url, read_time, word_count, rpm_score, status, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING *`,
    [
      article.slug,
      article.title,
      article.excerpt,
      article.content,
      JSON.stringify(article.key_points),
      article.category,
      article.tags,
      article.author_id,
      article.source_url,
      article.source_name,
      article.image_url,
      article.read_time,
      article.word_count,
      article.rpm_score,
      article.status || 'published',
      article.published_at || new Date().toISOString(),
    ]
  );
  return result.rows[0];
}

export async function getArticles(options: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}): Promise<{ articles: Article[]; total: number }> {
  const { page = 1, limit = 20, category, status = 'published' } = options;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE status = $1';
  const params: any[] = [status];

  if (category) {
    whereClause += ' AND category = $2';
    params.push(category);
  }

  const countResult = await db.query(
    `SELECT COUNT(*) FROM articles ${whereClause}`,
    params
  );

  const result = await db.query<Article>(
    `SELECT a.*,
            json_build_object('id', au.id, 'name', au.name, 'role', au.role, 'bio', au.bio) as author
     FROM articles a
     LEFT JOIN authors au ON a.author_id = au.id
     ${whereClause}
     ORDER BY published_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  return {
    articles: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const result = await db.query<Article>(
    `SELECT a.*,
            json_build_object('id', au.id, 'name', au.name, 'role', au.role, 'bio', au.bio) as author
     FROM articles a
     LEFT JOIN authors au ON a.author_id = au.id
     WHERE a.slug = $1`,
    [slug]
  );
  return result.rows[0] || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const result = await db.query<Article>(
    `SELECT a.*,
            json_build_object('id', au.id, 'name', au.name, 'role', au.role, 'bio', au.bio) as author
     FROM articles a
     LEFT JOIN authors au ON a.author_id = au.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function incrementArticleViews(id: string): Promise<void> {
  await db.query('UPDATE articles SET views = views + 1 WHERE id = $1', [id]);
}

export async function getTrendingArticles(limit: number = 10): Promise<Article[]> {
  const result = await db.query<Article>(
    `SELECT a.*,
            json_build_object('id', au.id, 'name', au.name, 'role', au.role) as author
     FROM articles a
     LEFT JOIN authors au ON a.author_id = au.id
     WHERE a.status = 'published'
     ORDER BY a.views DESC, a.published_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

// ============ DEDUPLICATION ============

export async function isUrlProcessed(url: string): Promise<boolean> {
  const hash = generateHash(url);
  const result = await db.query(
    'SELECT 1 FROM processed_urls WHERE url_hash = $1',
    [hash]
  );
  return result.rows.length > 0;
}

export async function isTitleProcessed(title: string): Promise<boolean> {
  const hash = generateHash(title.toLowerCase().trim());
  const result = await db.query(
    'SELECT 1 FROM processed_urls WHERE title_hash = $1',
    [hash]
  );
  return result.rows.length > 0;
}

export async function markUrlProcessed(url: string, title?: string): Promise<void> {
  const urlHash = generateHash(url);
  const titleHash = title ? generateHash(title.toLowerCase().trim()) : null;
  await db.query(
    `INSERT INTO processed_urls (url_hash, url, title_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (url_hash) DO NOTHING`,
    [urlHash, url, titleHash]
  );
}

// ============ RSS SOURCES ============

export async function getActiveSources(category?: string): Promise<RssSource[]> {
  let query = 'SELECT * FROM sources WHERE is_active = true';
  const params: any[] = [];

  if (category) {
    query += ' AND category = $1';
    params.push(category);
  }

  query += ' ORDER BY priority DESC';

  const result = await db.query<RssSource>(query, params);
  return result.rows;
}

export async function updateSourceLastFetched(id: string): Promise<void> {
  await db.query(
    'UPDATE sources SET last_fetched_at = NOW(), error_count = 0 WHERE id = $1',
    [id]
  );
}

export async function incrementSourceError(id: string): Promise<void> {
  await db.query(
    `UPDATE sources SET error_count = error_count + 1,
     is_active = CASE WHEN error_count >= 5 THEN false ELSE is_active END
     WHERE id = $1`,
    [id]
  );
}

// ============ TRENDS ============

export async function saveTrend(trend: Omit<Trend, 'id' | 'detected_at'>): Promise<Trend> {
  const result = await db.query<Trend>(
    `INSERT INTO trends (keyword, source, score, category, processed)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [trend.keyword, trend.source, trend.score, trend.category, trend.processed]
  );
  return result.rows[0];
}

export async function getUnprocessedTrends(limit: number = 20): Promise<Trend[]> {
  const result = await db.query<Trend>(
    `SELECT * FROM trends
     WHERE processed = false
     ORDER BY score DESC, detected_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function markTrendProcessed(id: string): Promise<void> {
  await db.query('UPDATE trends SET processed = true WHERE id = $1', [id]);
}

// ============ AUTHORS ============

export async function getRandomAuthor(category?: string): Promise<Author> {
  const result = await db.query<Author>(
    'SELECT * FROM authors ORDER BY RANDOM() LIMIT 1'
  );
  return result.rows[0];
}

export async function incrementAuthorArticleCount(id: string): Promise<void> {
  await db.query(
    'UPDATE authors SET article_count = article_count + 1 WHERE id = $1',
    [id]
  );
}

// ============ PERFORMANCE ============

export async function updateDailyPerformance(category: string, articleCount: number): Promise<void> {
  await db.query(
    `INSERT INTO performance_daily (date, category, article_count)
     VALUES (CURRENT_DATE, $1, $2)
     ON CONFLICT (date, category) DO UPDATE SET
       article_count = performance_daily.article_count + EXCLUDED.article_count`,
    [category, articleCount]
  );
}

export async function getCategoryPerformance(days: number = 7): Promise<any[]> {
  const result = await db.query(
    `SELECT category,
            SUM(article_count) as total_articles,
            SUM(total_views) as total_views,
            AVG(avg_rpm) as avg_rpm
     FROM performance_daily
     WHERE date >= CURRENT_DATE - $1
     GROUP BY category
     ORDER BY total_views DESC`,
    [days]
  );
  return result.rows;
}

// ============ CLEANUP ============

export async function cleanupOldData(daysOld: number = 90): Promise<{ deletedArticles: number; deletedTrends: number }> {
  const articlesResult = await db.query(
    `DELETE FROM articles
     WHERE published_at < NOW() - INTERVAL '${daysOld} days'
     AND views < 10
     AND status = 'published'
     RETURNING id`
  );

  const trendsResult = await db.query(
    `DELETE FROM trends
     WHERE detected_at < NOW() - INTERVAL '7 days'
     RETURNING id`
  );

  return {
    deletedArticles: articlesResult.rowCount || 0,
    deletedTrends: trendsResult.rowCount || 0,
  };
}
