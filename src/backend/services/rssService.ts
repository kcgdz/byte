import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import * as dbService from './dbService.js';
import type { RssSource } from '../../shared/types.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
    Accept: 'application/rss+xml, application/xml, text/xml',
  },
});

export interface RssItem {
  title: string;
  link: string;
  content: string;
  contentSnippet?: string;
  pubDate?: string;
  creator?: string;
  categories?: string[];
}

export interface ParsedArticle {
  title: string;
  url: string;
  content: string;
  excerpt: string;
  pubDate: string;
  sourceName: string;
  category: string;
}

// Fetch and parse RSS feed
export async function fetchFeed(source: RssSource): Promise<RssItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    await dbService.updateSourceLastFetched(source.id);
    return feed.items.map((item) => ({
      title: item.title || '',
      link: item.link || '',
      content: item.content || item['content:encoded'] || item.contentSnippet || '',
      contentSnippet: item.contentSnippet,
      pubDate: item.pubDate || item.isoDate,
      creator: item.creator || item.author,
      categories: item.categories,
    }));
  } catch (error) {
    console.error(`Error fetching feed ${source.name}:`, error);
    await dbService.incrementSourceError(source.id);
    return [];
  }
}

// Extract full article content from URL
export async function extractArticleContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return null;

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    return article?.textContent || null;
  } catch (error) {
    console.error(`Error extracting content from ${url}:`, error);
    return null;
  }
}

// Process RSS items with deduplication
export async function processRssItems(
  items: RssItem[],
  source: RssSource
): Promise<ParsedArticle[]> {
  const validArticles: ParsedArticle[] = [];

  for (const item of items) {
    // Skip if no URL or title
    if (!item.link || !item.title) continue;

    // Check URL deduplication
    const isUrlDupe = await dbService.isUrlProcessed(item.link);
    if (isUrlDupe) {
      continue;
    }

    // Check title similarity (prevent same story from different sources)
    const isTitleDupe = await dbService.isTitleProcessed(item.title);
    if (isTitleDupe) {
      continue;
    }

    // Get content - prefer RSS content, fallback to extraction
    let content = item.content;
    if (!content || content.length < 200) {
      const extracted = await extractArticleContent(item.link);
      if (extracted) {
        content = extracted;
      }
    }

    // Skip if still no content
    if (!content || content.length < 100) {
      continue;
    }

    // Mark as processed
    await dbService.markUrlProcessed(item.link, item.title);

    validArticles.push({
      title: item.title,
      url: item.link,
      content: content.slice(0, 10000), // Limit content length
      excerpt: item.contentSnippet || content.slice(0, 300),
      pubDate: item.pubDate || new Date().toISOString(),
      sourceName: source.name,
      category: source.category,
    });
  }

  return validArticles;
}

// Fetch all active sources and process
export async function fetchAllFeeds(category?: string): Promise<ParsedArticle[]> {
  const sources = await dbService.getActiveSources(category);
  const allArticles: ParsedArticle[] = [];

  console.log(`Fetching ${sources.length} RSS sources...`);

  for (const source of sources) {
    try {
      const items = await fetchFeed(source);
      const articles = await processRssItems(items, source);
      allArticles.push(...articles);
      console.log(`  ${source.name}: ${articles.length} new articles`);
    } catch (error) {
      console.error(`Error processing ${source.name}:`, error);
    }
  }

  console.log(`Total new articles: ${allArticles.length}`);
  return allArticles;
}

// Score article based on category RPM and content quality
export function scoreArticle(article: ParsedArticle): number {
  const categoryScores: Record<string, number> = {
    finance: 10,
    technology: 6,
    health: 7,
    science: 5,
    sports: 3,
    entertainment: 2,
  };

  let score = categoryScores[article.category] || 3;

  // Bonus for longer content
  if (article.content.length > 1000) score += 1;
  if (article.content.length > 2000) score += 1;

  // Bonus for recent content
  const pubDate = new Date(article.pubDate);
  const hoursSincePublished = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
  if (hoursSincePublished < 2) score += 2;
  else if (hoursSincePublished < 6) score += 1;

  return score;
}
