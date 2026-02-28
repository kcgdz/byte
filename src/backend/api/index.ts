import express from 'express';
import cors from 'cors';
import articlesRouter from './routes/articles.js';
import categoriesRouter from './routes/categories.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/articles', articlesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin', adminRouter);

// Sitemap endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { getArticles } = await import('../services/dbService.js');
    const { articles } = await getArticles({ page: 1, limit: 1000, status: 'published' });

    const baseUrl = process.env.FRONTEND_URL || 'https://example.com';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>`;

    for (const article of articles) {
      sitemap += `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    sitemap += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
