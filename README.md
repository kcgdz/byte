# byte. - Tech, Culture, Future

A sophisticated, high-performance technology news platform that automatically aggregates, summarizes, and categorizes content from multiple RSS sources using AI.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Express](https://img.shields.io/badge/Express-4-green?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)

---

## ⚠️ Legal Notice & Disclaimer

**IMPORTANT: This software is provided for EDUCATIONAL and DEMONSTRATION purposes only.**

### Content Copyright Notice
- This application fetches content via **RSS feeds** from third-party sources
- **All content rights belong to their respective owners**
- Users are responsible for:
  - Complying with each RSS source's **Terms of Service**
  - Obtaining necessary permissions from content publishers
  - Respecting `robots.txt` and rate limits
  - Complying with copyright laws in their jurisdiction

### API Usage
- This application requires a **Google Gemini API key**
- Users must use their **own API credentials**
- API usage costs and quotas are the user's responsibility
- Do not share or expose API keys in public repositories

### Disclaimer of Liability
The authors and contributors of this project:
- **Are not responsible** for how users deploy or use this software
- **Do not endorse** unauthorized content scraping or redistribution
- **Provide no warranty** of any kind, express or implied
- Users assume **full responsibility** for their use of this software

---

## Features

- **AI-Powered Content** - Articles automatically summarized and enhanced using Google Gemini
- **RSS Aggregation** - Automated content collection from multiple sources every 15 minutes
- **Smart Categorization** - AI automatically categorizes content into Technology, Finance, Health, Sports, Science, and Entertainment
- **Trending Topics** - Real-time trend analysis to surface popular content
- **Full-Text Search** - Powerful search across all articles
- **SEO Optimized** - Clean URLs, meta tags, and sitemap generation
- **Responsive Design** - Optimized for all devices
- **Dark/Light Mode** - Theme support

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TypeScript** - Type safety

### Backend
- **Express.js** - API server
- **BullMQ** - Queue system for background jobs
- **node-cron** - Scheduled tasks

### Database & Cache
- **PostgreSQL** - Primary database
- **Redis** - Caching and job queues

### AI & Scraping
- **Google Gemini** - Content summarization and generation
- **RSS Parser** - Feed aggregation
- **Mozilla Readability** - Content extraction

---

## Project Structure

```
├── components/          # React components
├── pages/              # Page components
├── services/           # Frontend services
├── src/
│   ├── backend/        # API and workers
│   │   ├── api/        # Express routes
│   │   ├── workers/    # Background job processors
│   │   └── services/   # Business logic
│   ├── frontend/       # Frontend utilities
│   └── shared/         # Shared types
├── scripts/            # Database scripts
├── docker/             # Docker configurations
└── ...
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kcgdz/byte.git
   cd byte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Create `.env.local` and add your own `GEMINI_API_KEY`.

4. **Setup database**
   ```bash
   # Create PostgreSQL database
   createdb byte_news
   
   # Run migrations
   npm run migrate
   
   # Seed RSS sources (optional - add your own legal sources)
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend API
   npm run dev:backend
   
   # Terminal 3 - Background workers
   npm run dev:workers
   ```

---

## Docker Deployment

### Development
```bash
cd docker
docker-compose up
```

### Production
The project includes Dockerfiles for production deployment:

- `docker/Dockerfile.backend` - API server + workers
- `docker/Dockerfile.frontend` - Static site

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your own Google Gemini API key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `PORT` | Backend port (default: 3001) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |
| `ADMIN_API_KEY` | Admin API authentication | Yes |
| `NODE_ENV` | Environment (development/production) | No |

**⚠️ Never commit `.env.local` or any file containing API keys to git!**

---

## RSS Source Guidelines

When adding RSS sources, ensure you:

1. ✅ **Check Terms of Service** - Verify the website allows RSS aggregation
2. ✅ **Respect Rate Limits** - Don't overwhelm source servers (default: 15 min intervals)
3. ✅ **Attribute Properly** - Always display original source and link back
4. ✅ **No Paywall Bypass** - Only use publicly available RSS feeds
5. ❌ **Don't Store Full Content** - Consider storing only summaries/metadata to reduce copyright concerns

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run dev:backend` | Start backend API |
| `npm run dev:workers` | Start background workers |
| `npm run build` | Build frontend for production |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed RSS sources (customize before running) |
| `npm run lint` | Type check with TypeScript |

---

## How It Works

1. **RSS Aggregation** - Workers periodically fetch RSS feeds from configured sources
2. **Deduplication** - Articles are checked against existing content (URL + title hash)
3. **Content Extraction** - Full article content is extracted using Mozilla Readability
4. **AI Processing** - Gemini AI generates summaries, categories, and tags
5. **Publishing** - Processed articles are stored and served via the API
6. **Trend Analysis** - Popular topics are identified and highlighted

---

## Categories

- **Technology** - Software, AI, gadgets, and digital innovation
- **Finance** - Markets, cryptocurrency, and business
- **Health** - Medical research and wellness
- **Sports** - Major leagues and international events
- **Science** - Space exploration and discoveries
- **Entertainment** - Film, music, gaming, and culture

---

## License

```
MIT License

Copyright (c) 2024 kcgdz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Additional Terms:**
- This license covers the **code only**, not the content fetched through RSS
- Users must ensure their use complies with applicable laws and third-party terms
- The authors assume no liability for misuse of this software

---

## Contributing

Contributions are welcome! Please ensure your contributions:
- Don't introduce copyright-infringing features
- Respect rate limiting and fair use principles
- Include appropriate documentation

---

Built with ❤️ using React, Express, and Gemini AI.

**Use responsibly. Respect content creators.**
