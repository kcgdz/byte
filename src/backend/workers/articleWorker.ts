import { Worker, Job } from 'bullmq';
import redis from '../config/redis.js';
import { QUEUE_CONFIG, CATEGORY_RPM } from '../config/constants.js';
import * as dbService from '../services/dbService.js';
import * as aiService from '../services/aiService.js';
import type { ArticleJobData } from '../../shared/types.js';

let worker: Worker | null = null;

async function processArticleJob(job: Job<ArticleJobData>): Promise<{ success: boolean; articleId?: string; error?: string }> {
  const { source_url, source_name, source_content, category, priority } = job.data;

  console.log(`Processing article: ${source_url.slice(0, 60)}...`);

  try {
    // Extract title from content (first line or first sentence)
    const titleMatch = source_content.match(/^(.+?)[\n\.]/);
    const title = titleMatch ? titleMatch[1].slice(0, 200) : 'Untitled Article';

    // Process with AI (evaluate + generate)
    const result = await aiService.processArticleWithAI(title, source_content, source_name);

    if (!result) {
      return { success: false, error: 'AI processing failed or article rejected' };
    }

    const { evaluation, article } = result;

    // Get random author
    const author = await dbService.getRandomAuthor();

    // Calculate word count
    const wordCount = aiService.calculateWordCount(article.content);

    // Calculate RPM score
    const categoryRpm = CATEGORY_RPM[evaluation.category as keyof typeof CATEGORY_RPM] || 3;
    const rpmScore = (evaluation.estimated_rpm + evaluation.evergreen_score + categoryRpm) / 3;

    // Create article in database
    const savedArticle = await dbService.createArticle({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      key_points: article.key_points,
      category: evaluation.category,
      tags: article.tags,
      author_id: author.id,
      source_url: source_url,
      source_name: source_name,
      image_url: `https://picsum.photos/seed/${article.slug}/800/600`, // Placeholder image
      read_time: article.read_time,
      word_count: wordCount,
      rpm_score: rpmScore,
      views: 0,
      status: 'published',
      published_at: new Date().toISOString(),
    });

    // Update author article count
    await dbService.incrementAuthorArticleCount(author.id);

    // Update daily performance
    await dbService.updateDailyPerformance(evaluation.category, 1);

    console.log(`Article created: ${savedArticle.slug}`);

    return { success: true, articleId: savedArticle.id };
  } catch (error) {
    console.error('Error processing article:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function startArticleWorker(): Worker {
  if (worker) return worker;

  worker = new Worker<ArticleJobData>(
    QUEUE_CONFIG.articleQueue.name,
    processArticleJob,
    {
      connection: redis,
      concurrency: QUEUE_CONFIG.articleQueue.concurrency,
      limiter: {
        max: QUEUE_CONFIG.articleQueue.rateLimitMax,
        duration: QUEUE_CONFIG.articleQueue.rateLimitDuration,
      },
    }
  );

  worker.on('completed', (job, result) => {
    if (result.success) {
      console.log(`Job ${job.id} completed: Article ${result.articleId}`);
    } else {
      console.log(`Job ${job.id} completed but article rejected: ${result.error}`);
    }
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  console.log('Article worker started');
  return worker;
}

export function stopArticleWorker(): Promise<void> {
  if (worker) {
    return worker.close();
  }
  return Promise.resolve();
}

export { worker as articleWorker };
