import { Router, Request, Response } from 'express';
import * as queueService from '../../services/queueService.js';
import * as dbService from '../../services/dbService.js';
import { triggerRssJob, triggerTrendJob, triggerCleanupJob } from '../../scheduler/jobs.js';

const router = Router();

// Simple API key auth middleware
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const validKey = process.env.ADMIN_API_KEY || 'dev-admin-key';

  if (apiKey !== validKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  next();
};

router.use(authMiddleware);

// GET /api/admin/stats - Get system statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [queueStats, performance] = await Promise.all([
      queueService.getQueueStats(),
      dbService.getCategoryPerformance(7),
    ]);

    res.json({
      success: true,
      data: {
        queues: queueStats,
        performance,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats',
    });
  }
});

// POST /api/admin/trigger/rss - Manually trigger RSS job
router.post('/trigger/rss', async (req: Request, res: Response) => {
  try {
    await triggerRssJob();
    res.json({
      success: true,
      message: 'RSS job triggered',
    });
  } catch (error) {
    console.error('Error triggering RSS job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger RSS job',
    });
  }
});

// POST /api/admin/trigger/trends - Manually trigger trend detection
router.post('/trigger/trends', async (req: Request, res: Response) => {
  try {
    await triggerTrendJob();
    res.json({
      success: true,
      message: 'Trend detection triggered',
    });
  } catch (error) {
    console.error('Error triggering trend job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger trend job',
    });
  }
});

// POST /api/admin/trigger/cleanup - Manually trigger cleanup
router.post('/trigger/cleanup', async (req: Request, res: Response) => {
  try {
    await triggerCleanupJob();
    res.json({
      success: true,
      message: 'Cleanup triggered',
    });
  } catch (error) {
    console.error('Error triggering cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger cleanup',
    });
  }
});

// POST /api/admin/queues/pause - Pause all queues
router.post('/queues/pause', async (req: Request, res: Response) => {
  try {
    await queueService.pauseQueues();
    res.json({
      success: true,
      message: 'Queues paused',
    });
  } catch (error) {
    console.error('Error pausing queues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to pause queues',
    });
  }
});

// POST /api/admin/queues/resume - Resume all queues
router.post('/queues/resume', async (req: Request, res: Response) => {
  try {
    await queueService.resumeQueues();
    res.json({
      success: true,
      message: 'Queues resumed',
    });
  } catch (error) {
    console.error('Error resuming queues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resume queues',
    });
  }
});

// GET /api/admin/sources - Get RSS sources
router.get('/sources', async (req: Request, res: Response) => {
  try {
    const sources = await dbService.getActiveSources();
    res.json({
      success: true,
      data: sources,
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sources',
    });
  }
});

export default router;
