import { Worker, Job } from 'bullmq';
import redis from '../config/redis.js';
import { QUEUE_CONFIG } from '../config/constants.js';
import * as trendService from '../services/trendService.js';
import type { TrendJobData } from '../../shared/types.js';

let worker: Worker | null = null;

async function processTrendJob(job: Job<TrendJobData>): Promise<{ success: boolean; count: number }> {
  const { source } = job.data;

  console.log(`Processing trend detection for: ${source}`);

  try {
    let trends = [];

    switch (source) {
      case 'google':
        trends = await trendService.fetchGoogleTrends();
        break;
      case 'reddit':
        trends = await trendService.fetchRedditTrends();
        break;
      default:
        trends = await trendService.fetchAllTrends();
    }

    console.log(`Detected ${trends.length} trends from ${source}`);

    return { success: true, count: trends.length };
  } catch (error) {
    console.error(`Error in trend detection for ${source}:`, error);
    throw error;
  }
}

export function startTrendWorker(): Worker {
  if (worker) return worker;

  worker = new Worker<TrendJobData>(
    QUEUE_CONFIG.trendQueue.name,
    processTrendJob,
    {
      connection: redis,
      concurrency: QUEUE_CONFIG.trendQueue.concurrency,
    }
  );

  worker.on('completed', (job, result) => {
    console.log(`Trend job ${job.id} completed: ${result.count} trends detected`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Trend job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('Trend worker error:', err);
  });

  console.log('Trend worker started');
  return worker;
}

export function stopTrendWorker(): Promise<void> {
  if (worker) {
    return worker.close();
  }
  return Promise.resolve();
}

export { worker as trendWorker };
