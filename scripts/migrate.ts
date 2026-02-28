import { db } from '../src/backend/config/database.js';

const migrations = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  key_points JSONB DEFAULT '[]',
  category VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id VARCHAR(50) NOT NULL,
  source_url TEXT,
  source_name VARCHAR(255),
  image_url TEXT,
  read_time INTEGER DEFAULT 5,
  word_count INTEGER DEFAULT 0,
  rpm_score DECIMAL(5,2) DEFAULT 0,
  views INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSS Sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trends log
CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(255) NOT NULL,
  source VARCHAR(50) NOT NULL,
  score INTEGER DEFAULT 0,
  category VARCHAR(50),
  processed BOOLEAN DEFAULT false,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance tracking
CREATE TABLE IF NOT EXISTS performance_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  article_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  estimated_revenue DECIMAL(10,2) DEFAULT 0,
  avg_rpm DECIMAL(5,2) DEFAULT 0,
  UNIQUE(date, category)
);

-- Processed URLs (deduplication)
CREATE TABLE IF NOT EXISTS processed_urls (
  url_hash VARCHAR(64) PRIMARY KEY,
  url TEXT NOT NULL,
  title_hash VARCHAR(64),
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  role VARCHAR(100),
  avatar_url TEXT,
  article_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_trends_processed ON trends(processed);
CREATE INDEX IF NOT EXISTS idx_trends_detected_at ON trends(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(is_active);
CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category);
CREATE INDEX IF NOT EXISTS idx_processed_urls_title ON processed_urls(title_hash);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

async function runMigrations() {
  console.log('Running database migrations...');

  try {
    await db.query(migrations);
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

runMigrations();
