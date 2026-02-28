// RSS Feed Sources - Extensive list for each category
export const RSS_SOURCES = {
  technology: [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', priority: 10 },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', priority: 10 },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss', priority: 9 },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', priority: 9 },
    { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', priority: 8 },
    { name: 'ZDNet', url: 'https://www.zdnet.com/news/rss.xml', priority: 8 },
    { name: 'TechRadar', url: 'https://www.techradar.com/rss', priority: 7 },
    { name: 'Gizmodo', url: 'https://gizmodo.com/rss', priority: 7 },
    { name: 'Mashable', url: 'https://mashable.com/feeds/rss/all', priority: 7 },
    { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', priority: 8 },
    { name: 'The Next Web', url: 'https://thenextweb.com/feed/', priority: 7 },
    { name: 'CNET', url: 'https://www.cnet.com/rss/news/', priority: 8 },
    { name: 'Digital Trends', url: 'https://www.digitaltrends.com/feed/', priority: 6 },
    { name: 'Tom\'s Hardware', url: 'https://www.tomshardware.com/feeds/all', priority: 7 },
    { name: 'AnandTech', url: 'https://www.anandtech.com/rss/', priority: 7 },
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss', priority: 9 },
    { name: 'TechMeme', url: 'https://www.techmeme.com/feed.xml', priority: 8 },
    { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', priority: 9 },
    { name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org/feeds/feed.rss', priority: 8 },
    { name: 'Slashdot', url: 'https://rss.slashdot.org/Slashdot/slashdotMain', priority: 7 },
  ],
  finance: [
    { name: 'Reuters Business', url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best', priority: 10 },
    { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', priority: 10 },
    { name: 'Bloomberg', url: 'https://www.bloomberg.com/feed/podcast/etf-report.xml', priority: 9 },
    { name: 'Financial Times', url: 'https://www.ft.com/rss/home', priority: 10 },
    { name: 'Wall Street Journal', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', priority: 10 },
    { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/', priority: 9 },
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', priority: 8 },
    { name: 'Investopedia', url: 'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline', priority: 8 },
    { name: 'Forbes', url: 'https://www.forbes.com/business/feed/', priority: 8 },
    { name: 'Business Insider', url: 'https://www.businessinsider.com/rss', priority: 8 },
    { name: 'The Economist', url: 'https://www.economist.com/finance-and-economics/rss.xml', priority: 9 },
    { name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', priority: 7 },
    { name: 'Motley Fool', url: 'https://www.fool.com/feeds/index.aspx', priority: 7 },
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', priority: 8 },
    { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss', priority: 7 },
  ],
  health: [
    { name: 'Medical News Today', url: 'https://www.medicalnewstoday.com/rss', priority: 9 },
    { name: 'Science Daily Health', url: 'https://www.sciencedaily.com/rss/health_medicine.xml', priority: 9 },
    { name: 'WebMD', url: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC', priority: 8 },
    { name: 'Healthline', url: 'https://www.healthline.com/rss', priority: 8 },
    { name: 'Mayo Clinic', url: 'https://newsnetwork.mayoclinic.org/feed/', priority: 9 },
    { name: 'Harvard Health', url: 'https://www.health.harvard.edu/blog/feed', priority: 9 },
    { name: 'NIH News', url: 'https://www.nih.gov/news-releases/feed.xml', priority: 10 },
    { name: 'CDC Newsroom', url: 'https://tools.cdc.gov/podcasts/feed.asp?feedid=183', priority: 9 },
    { name: 'Psychology Today', url: 'https://www.psychologytoday.com/intl/blog/feed', priority: 7 },
    { name: 'Medscape', url: 'https://www.medscape.com/cx/rssfeeds/2684.xml', priority: 8 },
    { name: 'STAT News', url: 'https://www.statnews.com/feed/', priority: 9 },
    { name: 'Fierce Healthcare', url: 'https://www.fiercehealthcare.com/rss/xml', priority: 7 },
  ],
  sports: [
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', priority: 10 },
    { name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/rss.xml', priority: 10 },
    { name: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', priority: 9 },
    { name: 'CBS Sports', url: 'https://www.cbssports.com/rss/headlines/', priority: 8 },
    { name: 'Sports Illustrated', url: 'https://www.si.com/rss/si_topstories.rss', priority: 8 },
    { name: 'Bleacher Report', url: 'https://bleacherreport.com/articles/feed', priority: 7 },
    { name: 'Yahoo Sports', url: 'https://sports.yahoo.com/rss/', priority: 8 },
    { name: 'The Athletic', url: 'https://theathletic.com/rss/', priority: 9 },
    { name: 'Sporting News', url: 'https://www.sportingnews.com/rss', priority: 7 },
    { name: 'NBC Sports', url: 'https://www.nbcsports.com/rss/headlines', priority: 8 },
    { name: 'Fox Sports', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmf', priority: 7 },
    { name: 'Goal.com', url: 'https://www.goal.com/feeds/en/news', priority: 7 },
  ],
  science: [
    { name: 'Science Daily', url: 'https://www.sciencedaily.com/rss/all.xml', priority: 9 },
    { name: 'Nature', url: 'https://www.nature.com/nature.rss', priority: 10 },
    { name: 'Scientific American', url: 'https://rss.sciam.com/ScientificAmerican-Global', priority: 9 },
    { name: 'New Scientist', url: 'https://www.newscientist.com/feed/home/', priority: 8 },
    { name: 'Live Science', url: 'https://www.livescience.com/feeds/all', priority: 8 },
    { name: 'Space.com', url: 'https://www.space.com/feeds/all', priority: 8 },
    { name: 'Phys.org', url: 'https://phys.org/rss-feed/', priority: 9 },
    { name: 'Science Magazine', url: 'https://www.science.org/rss/news_current.xml', priority: 10 },
    { name: 'NASA', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', priority: 9 },
    { name: 'ESA', url: 'https://www.esa.int/rssfeed/Our_Activities/Space_Science', priority: 8 },
    { name: 'Smithsonian', url: 'https://www.smithsonianmag.com/rss/latest_articles/', priority: 8 },
    { name: 'National Geographic', url: 'https://www.nationalgeographic.com/feed', priority: 8 },
  ],
  entertainment: [
    { name: 'Variety', url: 'https://variety.com/feed/', priority: 9 },
    { name: 'Hollywood Reporter', url: 'https://www.hollywoodreporter.com/feed/', priority: 9 },
    { name: 'Deadline', url: 'https://deadline.com/feed/', priority: 8 },
    { name: 'Entertainment Weekly', url: 'https://ew.com/feed/', priority: 8 },
    { name: 'Rolling Stone', url: 'https://www.rollingstone.com/feed/', priority: 8 },
    { name: 'Billboard', url: 'https://www.billboard.com/feed/', priority: 8 },
    { name: 'Pitchfork', url: 'https://pitchfork.com/feed/feed-news/rss', priority: 7 },
    { name: 'IGN', url: 'https://www.ign.com/rss/articles/feed', priority: 8 },
    { name: 'Kotaku', url: 'https://kotaku.com/rss', priority: 7 },
    { name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml', priority: 7 },
    { name: 'Screen Rant', url: 'https://screenrant.com/feed/', priority: 6 },
    { name: 'Collider', url: 'https://collider.com/feed/', priority: 7 },
  ],
};

// Trend sources
export const TREND_SOURCES = {
  google: {
    us: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US',
    uk: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=GB',
    global: 'https://trends.google.com/trends/trendingsearches/daily/rss',
  },
  reddit: {
    technology: 'https://www.reddit.com/r/technology/hot.json?limit=25',
    worldnews: 'https://www.reddit.com/r/worldnews/hot.json?limit=25',
    science: 'https://www.reddit.com/r/science/hot.json?limit=25',
    business: 'https://www.reddit.com/r/business/hot.json?limit=25',
  },
};

// Queue configuration
export const QUEUE_CONFIG = {
  articleQueue: {
    name: 'article-generation',
    concurrency: 5,
    rateLimitMax: 20,
    rateLimitDuration: 60000, // 1 minute
  },
  trendQueue: {
    name: 'trend-detection',
    concurrency: 3,
  },
};

// Scheduler intervals
export const SCHEDULER_INTERVALS = {
  trendJob: '*/30 * * * *',      // Every 30 minutes
  rssJob: '*/15 * * * *',        // Every 15 minutes
  cleanupJob: '0 3 * * *',       // Daily at 3 AM
  optimizeJob: '0 0 * * 0',      // Weekly on Sunday
};

// Category RPM estimates (USD per 1000 views)
export const CATEGORY_RPM = {
  technology: 6,
  finance: 10,
  health: 7,
  sports: 3,
  science: 5,
  entertainment: 2,
};

// Authors pool for random assignment (editorial desks instead of personal names)
export const AUTHORS = [
  { id: 'author-1', name: 'Uprsoft Tech', role: 'Tech Editor', bio: 'Technology desk covering AI, startups, and digital innovation.' },
  { id: 'author-2', name: 'Uprsoft Finance', role: 'Finance Desk', bio: 'Finance desk covering markets, cryptocurrency, and business news.' },
  { id: 'author-3', name: 'Uprsoft Health', role: 'Health Desk', bio: 'Health desk covering medical research, healthcare, and wellness.' },
  { id: 'author-4', name: 'Uprsoft Sports', role: 'Sports Desk', bio: 'Sports desk covering major leagues and international events.' },
  { id: 'author-5', name: 'Uprsoft Science', role: 'Science Desk', bio: 'Science desk covering space exploration, research, and discoveries.' },
  { id: 'author-6', name: 'Uprsoft Editorial', role: 'Editorial Team', bio: 'The Uprsoft editorial team covering news, culture, and entertainment.' },
];
