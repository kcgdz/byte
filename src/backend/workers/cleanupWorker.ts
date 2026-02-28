import * as dbService from '../services/dbService.js';
import * as queueService from '../services/queueService.js';

export async function runCleanup(): Promise<{
  deletedArticles: number;
  deletedTrends: number;
}> {
  console.log('Running cleanup job...');

  try {
    // Clean old articles and trends from database
    const { deletedArticles, deletedTrends } = await dbService.cleanupOldData(90);

    // Clean old jobs from queues
    await queueService.cleanQueues();

    console.log(`Cleanup completed: ${deletedArticles} articles, ${deletedTrends} trends deleted`);

    return { deletedArticles, deletedTrends };
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
}

export async function runOptimization(): Promise<void> {
  console.log('Running optimization job...');

  try {
    // Get category performance for the last 7 days
    const performance = await dbService.getCategoryPerformance(7);

    console.log('Category Performance (last 7 days):');
    for (const cat of performance) {
      console.log(`  ${cat.category}: ${cat.total_articles} articles, ${cat.total_views} views, $${cat.avg_rpm} RPM`);
    }

    // TODO: Implement auto-adjustment of source priorities based on performance
    // This would involve:
    // 1. Analyzing which categories perform best
    // 2. Adjusting source priorities accordingly
    // 3. Potentially disabling underperforming sources

    console.log('Optimization completed');
  } catch (error) {
    console.error('Optimization error:', error);
    throw error;
  }
}
