import { Router, Request, Response } from 'express';
import { CATEGORIES } from '../../../shared/types.js';
import * as dbService from '../../services/dbService.js';

const router = Router();

// GET /api/categories - List all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = Object.entries(CATEGORIES).map(([id, data]) => ({
      id,
      name: data.name,
      rpm: data.rpm,
    }));

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
});

// GET /api/categories/:id/articles - Get articles by category
router.get('/:id/articles', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const { articles, total } = await dbService.getArticles({
      page,
      limit,
      category: id,
      status: 'published',
    });

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching category articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category articles',
    });
  }
});

// GET /api/categories/performance - Get category performance stats
router.get('/stats/performance', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const performance = await dbService.getCategoryPerformance(days);

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    console.error('Error fetching category performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category performance',
    });
  }
});

export default router;
