import { Router, Request, Response } from 'express';
import * as dbService from '../../services/dbService.js';

const router = Router();

// GET /api/articles - List articles with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const category = req.query.category as string | undefined;
    const status = (req.query.status as string) || 'published';

    const { articles, total } = await dbService.getArticles({
      page,
      limit,
      category,
      status,
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
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles',
    });
  }
});

// GET /api/articles/trending - Get trending articles
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const articles = await dbService.getTrendingArticles(limit);

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending articles',
    });
  }
});

// GET /api/articles/:slug - Get single article by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const article = await dbService.getArticleBySlug(slug);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    // Increment view count (async, don't wait)
    dbService.incrementArticleViews(article.id).catch(console.error);

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article',
    });
  }
});

// GET /api/articles/id/:id - Get single article by ID
router.get('/id/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await dbService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article',
    });
  }
});

export default router;
