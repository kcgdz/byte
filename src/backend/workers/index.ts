import { startArticleWorker, stopArticleWorker } from './articleWorker.js';
import { startTrendWorker, stopTrendWorker } from './trendWorker.js';
import { runCleanup, runOptimization } from './cleanupWorker.js';
import { startScheduler, stopScheduler } from '../scheduler/jobs.js';
import { closeQueues } from '../services/queueService.js';
import redis from '../config/redis.js';

console.log('Starting workers...');

// Start all workers
const articleWorker = startArticleWorker();
const trendWorker = startTrendWorker();

// Start scheduler
startScheduler();

console.log('All workers and scheduler started');

// Graceful shutdown
async function shutdown() {
  console.log('\nShutting down...');

  try {
    stopScheduler();
    await stopArticleWorker();
    await stopTrendWorker();
    await closeQueues();
    await redis.quit();
    console.log('Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Export for manual triggering
export { runCleanup, runOptimization };
