import cron from 'node-cron';
import { SCHEDULER_INTERVALS } from '../config/constants.js';
import * as rssService from '../services/rssService.js';
import * as queueService from '../services/queueService.js';
import { runCleanup, runOptimization } from '../workers/cleanupWorker.js';

const scheduledJobs: cron.ScheduledTask[] = [];

// RSS Feed Job - Every 15 minutes
async function rssJob() {
  console.log('\n[Scheduler] Running RSS feed job...');

  try {
    const articles = await rssService.fetchAllFeeds();

    // Sort by score and add to queue
    const scoredArticles = articles
      .map((article) => ({
        ...article,
        score: rssService.scoreArticle(article),
      }))
      .sort((a, b) => b.score - a.score);

    let addedCount = 0;
    for (const article of scoredArticles) {
      await queueService.addArticleJob(
        {
          source_url: article.url,
          source_name: article.sourceName,
          source_content: article.content,
          category: article.category,
          priority: article.score,
        },
        article.score
      );
      addedCount++;
    }

    console.log(`[Scheduler] RSS job completed: ${addedCount} articles queued`);
  } catch (error) {
    console.error('[Scheduler] RSS job error:', error);
  }
}

// Trend Detection Job - Every 30 minutes
async function trendJob() {
  console.log('\n[Scheduler] Running trend detection job...');

  try {
    await queueService.addTrendJob('google');
    await queueService.addTrendJob('reddit');
    console.log('[Scheduler] Trend detection jobs queued');
  } catch (error) {
    console.error('[Scheduler] Trend job error:', error);
  }
}

// Cleanup Job - Daily at 3 AM
async function cleanupJob() {
  console.log('\n[Scheduler] Running cleanup job...');

  try {
    const result = await runCleanup();
    console.log(`[Scheduler] Cleanup completed: ${result.deletedArticles} articles, ${result.deletedTrends} trends removed`);
  } catch (error) {
    console.error('[Scheduler] Cleanup job error:', error);
  }
}

// Optimization Job - Weekly on Sunday
async function optimizeJob() {
  console.log('\n[Scheduler] Running optimization job...');

  try {
    await runOptimization();
    console.log('[Scheduler] Optimization completed');
  } catch (error) {
    console.error('[Scheduler] Optimization job error:', error);
  }
}

export function startScheduler() {
  console.log('Starting scheduler...');

  // RSS Job - every 15 minutes
  const rssTask = cron.schedule(SCHEDULER_INTERVALS.rssJob, rssJob, {
    scheduled: true,
    timezone: 'UTC',
  });
  scheduledJobs.push(rssTask);

  // Trend Job - every 30 minutes
  const trendTask = cron.schedule(SCHEDULER_INTERVALS.trendJob, trendJob, {
    scheduled: true,
    timezone: 'UTC',
  });
  scheduledJobs.push(trendTask);

  // Cleanup Job - daily at 3 AM
  const cleanupTask = cron.schedule(SCHEDULER_INTERVALS.cleanupJob, cleanupJob, {
    scheduled: true,
    timezone: 'UTC',
  });
  scheduledJobs.push(cleanupTask);

  // Optimization Job - weekly on Sunday at midnight
  const optimizeTask = cron.schedule(SCHEDULER_INTERVALS.optimizeJob, optimizeJob, {
    scheduled: true,
    timezone: 'UTC',
  });
  scheduledJobs.push(optimizeTask);

  console.log('Scheduler started with jobs:');
  console.log(`  - RSS: ${SCHEDULER_INTERVALS.rssJob}`);
  console.log(`  - Trends: ${SCHEDULER_INTERVALS.trendJob}`);
  console.log(`  - Cleanup: ${SCHEDULER_INTERVALS.cleanupJob}`);
  console.log(`  - Optimize: ${SCHEDULER_INTERVALS.optimizeJob}`);

  // Run RSS job immediately on startup
  setTimeout(() => {
    console.log('\n[Scheduler] Running initial RSS fetch...');
    rssJob();
  }, 5000);
}

export function stopScheduler() {
  console.log('Stopping scheduler...');
  for (const job of scheduledJobs) {
    job.stop();
  }
  scheduledJobs.length = 0;
}

// Manual trigger functions for testing
export async function triggerRssJob() {
  return rssJob();
}

export async function triggerTrendJob() {
  return trendJob();
}

export async function triggerCleanupJob() {
  return cleanupJob();
}
