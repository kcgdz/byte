import { Article, Category, Author } from './types';

export const AUTHORS: Author[] = [
  { id: 'author-1', name: 'Byte Tech', avatar: '', initials: 'UT', bio: 'Technology desk covering AI, startups, and digital innovation.', role: 'Tech Editor', articleCount: 47 },
  { id: 'author-2', name: 'Byte Finance', avatar: '', initials: 'UF', bio: 'Finance desk covering markets, cryptocurrency, and business news.', role: 'Finance Desk', articleCount: 32 },
  { id: 'author-3', name: 'Byte Health', avatar: '', initials: 'UH', bio: 'Health desk covering medical research, healthcare, and wellness.', role: 'Health Desk', articleCount: 28 },
  { id: 'author-4', name: 'Byte Sports', avatar: '', initials: 'US', bio: 'Sports desk covering major leagues and international events.', role: 'Sports Desk', articleCount: 41 },
  { id: 'author-5', name: 'Byte Science', avatar: '', initials: 'US', bio: 'Science desk covering space exploration, research, and discoveries.', role: 'Science Desk', articleCount: 23 },
  { id: 'author-6', name: 'Byte Editorial', avatar: '', initials: 'UE', bio: 'The Byte editorial team covering news, culture, and entertainment.', role: 'Editorial Team', articleCount: 56 }
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', description: 'Latest content from all categories' },
  { id: 'technology', name: 'Technology', description: 'Tech news, software, gadgets, and digital innovation' },
  { id: 'finance', name: 'Finance', description: 'Markets, cryptocurrency, business, and economic news' },
  { id: 'health', name: 'Health', description: 'Medical research, healthcare, and wellness updates' },
  { id: 'sports', name: 'Sports', description: 'Major leagues, international events, and sports news' },
  { id: 'science', name: 'Science', description: 'Space exploration, research, and scientific discoveries' },
  { id: 'entertainment', name: 'Entertainment', description: 'Film, music, gaming, and pop culture' }
];

// Fallback articles for when API is not available
export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'rise-of-ai-agents-transforming-how-we-work',
    title: 'The Rise of AI Agents: Transforming How We Work',
    excerpt: 'Autonomous AI systems are reshaping industries from customer service to software development, promising unprecedented productivity gains.',
    content: `AI agents are emerging as the next major paradigm shift in artificial intelligence, moving beyond simple chatbots to truly autonomous systems capable of complex reasoning and action.

## What Are AI Agents?

Unlike traditional AI assistants that respond to prompts, AI agents can plan, execute multi-step tasks, and learn from their actions. They represent a fundamental shift from reactive to proactive AI systems.

## Key Applications

### Software Development
AI agents are now writing, testing, and deploying code with minimal human oversight. Companies report 40-60% productivity gains in development workflows.

### Customer Service
Autonomous agents handle complex customer inquiries, routing issues, and even making decisions that previously required human judgment.

### Research
Scientific AI agents can formulate hypotheses, design experiments, and analyze results, accelerating research timelines dramatically.

## The Road Ahead

While impressive, AI agents still face challenges around reliability, safety, and alignment. The next few years will be crucial in determining how these systems integrate into our daily work lives.`,
    category: 'Technology',
    author: AUTHORS[0],
    date: 'Feb 24, 2026',
    readTime: '8 min',
    imageUrl: 'https://picsum.photos/seed/aiagents/800/600',
    isTrending: true,
    tags: ['AI', 'Automation', 'Future of Work']
  },
  {
    id: '2',
    slug: 'bitcoin-surges-past-100k-whats-driving-the-rally',
    title: 'Bitcoin Surges Past $100K: What\'s Driving the Rally',
    excerpt: 'The cryptocurrency market sees unprecedented institutional adoption as Bitcoin breaks through psychological barriers.',
    content: `Bitcoin has achieved what many thought impossible just years ago, surpassing the $100,000 mark amid a wave of institutional adoption and regulatory clarity.

## The Catalyst

Several factors converged to drive this historic rally:

### Institutional Adoption
Major asset managers now hold Bitcoin in client portfolios, with ETF inflows reaching record levels. The legitimization of crypto as an asset class is complete.

### Regulatory Clarity
New frameworks in the US and EU have given institutions the confidence to participate. Clear rules around custody and taxation have removed key barriers.

### Halving Effect
The 2024 halving reduced new supply precisely as demand accelerated, creating the supply shock that Bitcoin maximalists had predicted.

## What's Next

Analysts are split on whether this rally has legs. Some see $150K by year-end, while others warn of a correction. One thing is certain: Bitcoin is no longer a fringe asset.`,
    category: 'Finance',
    author: AUTHORS[1],
    date: 'Feb 24, 2026',
    readTime: '6 min',
    imageUrl: 'https://picsum.photos/seed/bitcoin100k/800/600',
    tags: ['Bitcoin', 'Cryptocurrency', 'Markets']
  },
  {
    id: '3',
    slug: 'breakthrough-cancer-treatment-shows-90-percent-response-rate',
    title: 'Breakthrough Cancer Treatment Shows 90% Response Rate',
    excerpt: 'A new immunotherapy approach combining AI-designed antibodies with personalized vaccines achieves remarkable results in clinical trials.',
    content: `A groundbreaking cancer treatment has shown a 90% response rate in early clinical trials, offering hope for patients with previously untreatable cancers.

## The Science

The treatment combines three cutting-edge approaches:

### AI-Designed Antibodies
Machine learning algorithms designed novel antibodies that target cancer cells with unprecedented precision, minimizing side effects.

### Personalized Vaccines
Each patient receives a custom vaccine created from their tumor's unique genetic signature, training their immune system to recognize and attack cancer cells.

### Checkpoint Inhibitors
The combination therapy includes next-generation checkpoint inhibitors that prevent cancer cells from evading immune detection.

## Trial Results

In a 200-patient trial:
- 90% showed significant tumor reduction
- 60% achieved complete remission
- Side effects were manageable in most cases

## Availability

The treatment is expected to seek FDA approval within 18 months, with initial availability for specific cancer types before broader applications.`,
    category: 'Health',
    author: AUTHORS[2],
    date: 'Feb 23, 2026',
    readTime: '7 min',
    imageUrl: 'https://picsum.photos/seed/cancercure/800/600',
    isTrending: true,
    tags: ['Cancer', 'Immunotherapy', 'Medical Research']
  }
];

export const TRENDING_TITLES = [
  "SpaceX Starship Mars Mission Update",
  "New JavaScript Framework Takes Over",
  "Climate Summit Reaches Historic Agreement",
  "Electric Vehicle Sales Surpass Gas Cars",
  "AI Regulation Bill Passes Senate"
];

export const STAFF_PICKS = [
  { id: 's1', title: 'The Hidden Cost of Cloud Computing', category: 'Analysis', readTime: '8 min' },
  { id: 's2', title: 'Why Privacy-First Social Networks Are Rising', category: 'Opinion', readTime: '6 min' },
  { id: 's3', title: 'Hardware Is Hard: A Decade of Startup Failures', category: 'Deep Dive', readTime: '12 min' }
];
