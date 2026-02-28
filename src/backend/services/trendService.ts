import Parser from 'rss-parser';
import { TREND_SOURCES, CATEGORY_RPM } from '../config/constants.js';
import * as dbService from './dbService.js';
import type { Trend } from '../../shared/types.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
  },
});

interface GoogleTrendItem {
  title: string;
  traffic?: string;
  link?: string;
}

interface RedditPost {
  title: string;
  score: number;
  url: string;
  subreddit: string;
  created_utc: number;
}

// Fetch Google Trends
export async function fetchGoogleTrends(): Promise<Trend[]> {
  const trends: Trend[] = [];

  try {
    for (const [region, url] of Object.entries(TREND_SOURCES.google)) {
      const feed = await parser.parseURL(url);

      for (const item of feed.items.slice(0, 10)) {
        if (!item.title) continue;

        // Parse traffic number if available
        let score = 50;
        const trafficMatch = item.title.match(/(\d+(?:,\d+)*)\+?/);
        if (trafficMatch) {
          score = parseInt(trafficMatch[1].replace(/,/g, ''));
        }

        const trend: Omit<Trend, 'id' | 'detected_at'> = {
          keyword: item.title.split(' - ')[0] || item.title,
          source: 'google',
          score: Math.min(score, 10000),
          category: categorizeKeyword(item.title),
          processed: false,
        };

        trends.push(await dbService.saveTrend(trend));
      }
    }

    console.log(`Fetched ${trends.length} Google Trends`);
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
  }

  return trends;
}

// Fetch Reddit hot posts
export async function fetchRedditTrends(): Promise<Trend[]> {
  const trends: Trend[] = [];

  for (const [subreddit, url] of Object.entries(TREND_SOURCES.reddit)) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NewsBot/1.0',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const posts: RedditPost[] = data.data.children.map((child: any) => child.data);

      for (const post of posts.slice(0, 10)) {
        // Skip stickied/pinned posts
        if (post.score < 100) continue;

        const trend: Omit<Trend, 'id' | 'detected_at'> = {
          keyword: post.title.slice(0, 200),
          source: 'reddit',
          score: Math.min(Math.floor(post.score / 100), 100),
          category: mapSubredditToCategory(subreddit),
          processed: false,
        };

        trends.push(await dbService.saveTrend(trend));
      }

      console.log(`Fetched ${posts.length} posts from r/${subreddit}`);
    } catch (error) {
      console.error(`Error fetching r/${subreddit}:`, error);
    }
  }

  return trends;
}

// Map subreddit to category
function mapSubredditToCategory(subreddit: string): string {
  const mapping: Record<string, string> = {
    technology: 'technology',
    worldnews: 'news',
    science: 'science',
    business: 'finance',
  };
  return mapping[subreddit] || 'general';
}

// Try to categorize a keyword based on common terms
function categorizeKeyword(keyword: string): string {
  const lower = keyword.toLowerCase();

  const categoryPatterns: Record<string, string[]> = {
    technology: ['ai', 'tech', 'software', 'app', 'google', 'apple', 'microsoft', 'computer', 'phone', 'iphone', 'android', 'nvidia', 'tesla'],
    finance: ['stock', 'market', 'bitcoin', 'crypto', 'bank', 'economy', 'inflation', 'interest', 'fed', 'dollar', 'investment'],
    health: ['health', 'covid', 'vaccine', 'medical', 'drug', 'hospital', 'cancer', 'disease', 'fda'],
    sports: ['nfl', 'nba', 'soccer', 'football', 'basketball', 'baseball', 'mlb', 'game', 'championship', 'world cup'],
    science: ['space', 'nasa', 'climate', 'research', 'study', 'discovery', 'scientist'],
    entertainment: ['movie', 'film', 'music', 'celebrity', 'oscar', 'grammy', 'concert', 'album'],
  };

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some((pattern) => lower.includes(pattern))) {
      return category;
    }
  }

  return 'general';
}

// Fetch all trends
export async function fetchAllTrends(): Promise<Trend[]> {
  console.log('Fetching trends from all sources...');

  const [googleTrends, redditTrends] = await Promise.all([
    fetchGoogleTrends(),
    fetchRedditTrends(),
  ]);

  const allTrends = [...googleTrends, ...redditTrends];
  console.log(`Total trends fetched: ${allTrends.length}`);

  return allTrends;
}

// Get trending keywords for content discovery
export async function getTrendingKeywords(limit: number = 20): Promise<string[]> {
  const trends = await dbService.getUnprocessedTrends(limit);
  return trends.map((t) => t.keyword);
}

// Score and prioritize trends
export function scoreTrend(trend: Trend): number {
  let score = trend.score;

  // Category multiplier
  const categoryRpm = CATEGORY_RPM[trend.category as keyof typeof CATEGORY_RPM] || 3;
  score *= categoryRpm / 5;

  // Recency boost
  const hoursSinceDetected = (Date.now() - new Date(trend.detected_at).getTime()) / (1000 * 60 * 60);
  if (hoursSinceDetected < 1) score *= 2;
  else if (hoursSinceDetected < 6) score *= 1.5;

  // Source boost
  if (trend.source === 'google') score *= 1.5; // Google trends are more valuable

  return Math.round(score);
}
