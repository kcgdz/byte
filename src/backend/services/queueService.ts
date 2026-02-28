import { Queue, QueueEvents } from 'bullmq';
import redis from '../config/redis.js';
import { QUEUE_CONFIG } from '../config/constants.js';
import type { ArticleJobData, TrendJobData } from '../../shared/types.js';

// Article generation queue
export const articleQueue = new Queue<ArticleJobData>(QUEUE_CONFIG.articleQueue.name, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 3600, // 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 86400, // 24 hours
    },
  },
});

// Trend detection queue
export const trendQueue = new Queue<TrendJobData>(QUEUE_CONFIG.trendQueue.name, {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 10000,
    },
    removeOnComplete: true,
    removeOnFail: {
      age: 3600,
    },
  },
});

// Queue events for monitoring
export const articleQueueEvents = new QueueEvents(QUEUE_CONFIG.articleQueue.name, {
  connection: redis,
});

export const trendQueueEvents = new QueueEvents(QUEUE_CONFIG.trendQueue.name, {
  connection: redis,
});

// Add article to generation queue
export async function addArticleJob(data: ArticleJobData, priority: number = 5): Promise<string> {
  const job = await articleQueue.add('generate-article', data, {
    priority: 10 - priority, // Lower number = higher priority in BullMQ
    jobId: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });
  return job.id || '';
}

// Add trend detection job
export async function addTrendJob(source: 'google' | 'reddit' | 'twitter'): Promise<string> {
  const job = await trendQueue.add('detect-trends', { source }, {
    jobId: `trend-${source}-${Date.now()}`,
  });
  return job.id || '';
}

// Get queue statistics
export async function getQueueStats(): Promise<{
  articleQueue: { waiting: number; active: number; completed: number; failed: number };
  trendQueue: { waiting: number; active: number; completed: number; failed: number };
}> {
  const [articleWaiting, articleActive, articleCompleted, articleFailed] = await Promise.all([
    articleQueue.getWaitingCount(),
    articleQueue.getActiveCount(),
    articleQueue.getCompletedCount(),
    articleQueue.getFailedCount(),
  ]);

  const [trendWaiting, trendActive, trendCompleted, trendFailed] = await Promise.all([
    trendQueue.getWaitingCount(),
    trendQueue.getActiveCount(),
    trendQueue.getCompletedCount(),
    trendQueue.getFailedCount(),
  ]);

  return {
    articleQueue: {
      waiting: articleWaiting,
      active: articleActive,
      completed: articleCompleted,
      failed: articleFailed,
    },
    trendQueue: {
      waiting: trendWaiting,
      active: trendActive,
      completed: trendCompleted,
      failed: trendFailed,
    },
  };
}

// Pause/Resume queues
export async function pauseQueues(): Promise<void> {
  await Promise.all([articleQueue.pause(), trendQueue.pause()]);
}

export async function resumeQueues(): Promise<void> {
  await Promise.all([articleQueue.resume(), trendQueue.resume()]);
}

// Clean old jobs
export async function cleanQueues(): Promise<void> {
  await Promise.all([
    articleQueue.clean(3600000, 1000, 'completed'), // 1 hour old completed
    articleQueue.clean(86400000, 100, 'failed'), // 24 hours old failed
    trendQueue.clean(3600000, 100, 'completed'),
    trendQueue.clean(86400000, 50, 'failed'),
  ]);
}

// Graceful shutdown
export async function closeQueues(): Promise<void> {
  await Promise.all([
    articleQueue.close(),
    trendQueue.close(),
    articleQueueEvents.close(),
    trendQueueEvents.close(),
  ]);
}
