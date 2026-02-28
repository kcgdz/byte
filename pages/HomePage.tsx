import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ARTICLES, CATEGORIES } from '../constants';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';
import { searchTechTopics } from '../services/geminiService';
import type { Article } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<{text: string, sources: any[]} | null>(null);

  // API state
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles from API
  useEffect(() => {
    async function fetchArticles() {
      if (!API_URL) {
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({ limit: '20' });
        if (selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }

        const response = await fetch(`${API_URL}/api/articles?${params}`);
        const data = await response.json();

        if (data.success && data.data?.length > 0) {
          // Transform API data to match frontend format
          const transformed = data.data.map((a: any) => ({
            ...a,
            date: new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: `${a.read_time} min`,
            imageUrl: a.image_url || `https://picsum.photos/seed/${a.slug}/800/600`,
          }));
          setArticles(transformed);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        // Keep mock data on error
      }

      setLoading(false);
    }

    fetchArticles();
  }, [selectedCategory]);

  // Fetch trending articles
  useEffect(() => {
    async function fetchTrending() {
      if (!API_URL) return;

      try {
        const response = await fetch(`${API_URL}/api/articles/trending?limit=5`);
        const data = await response.json();

        if (data.success && data.data?.length > 0) {
          const transformed = data.data.map((a: any) => ({
            ...a,
            date: new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: `${a.read_time} min`,
          }));
          setTrendingArticles(transformed);
        }
      } catch (error) {
        console.error('Error fetching trending:', error);
      }
    }

    fetchTrending();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const result = await searchTechTopics(searchQuery);
    setAiSearchResults(result);
    setIsSearching(false);
  };

  const heroArticle = articles[0] || MOCK_ARTICLES[0];
  const gridArticles = articles.slice(1, 4).length ? articles.slice(1, 4) : MOCK_ARTICLES.slice(1, 4);
  const trending = trendingArticles.length ? trendingArticles : articles.slice(4, 7);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
        {/* Main Hero Slot */}
        <section className="mb-20">
          <Link
            to={`/article/${heroArticle.slug || heroArticle.id}`}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-200 overflow-hidden"
          >
            <div className="lg:col-span-8 overflow-hidden aspect-video lg:aspect-auto">
              <img
                src={heroArticle.imageUrl}
                alt={heroArticle.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-4 p-8 sm:p-12 flex flex-col justify-center bg-white border-l-0 lg:border-l border-gray-200">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff4d00] mb-6 block">
                {heroArticle.category}
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl leading-[0.95] font-normal mb-6 group-hover:underline decoration-1 underline-offset-4">
                {heroArticle.title}
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-3">
                {heroArticle.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                <span className="text-xs font-bold uppercase">{heroArticle.author?.name || 'Staff'}</span>
                <span className="text-[10px] font-mono text-gray-400">{heroArticle.readTime} READ</span>
              </div>
            </div>
          </Link>
        </section>

        {/* Secondary Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {gridArticles.map(article => (
              <Link
                key={article.id}
                to={`/article/${article.slug || article.id}`}
                className="group cursor-pointer flex flex-col border border-gray-200 p-6 hover:bg-gray-50 transition-colors h-full"
              >
                <div className="aspect-[4/3] overflow-hidden mb-6">
                  <img src={article.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{article.category}</span>
                <h3 className="font-serif text-3xl leading-[1.1] mb-4 group-hover:text-[#ff4d00] transition-colors">{article.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6">{article.excerpt}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold">
                  <span className="uppercase">{article.author?.name || 'Staff'}</span>
                  <span className="text-gray-400">{article.date}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="border-l border-gray-100 pl-8 hidden lg:block">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 underline decoration-[#ff4d00] underline-offset-8">Trending Today</h4>
            <div className="flex flex-col gap-8">
              {trending.slice(0, 3).map((a, i) => (
                <Link key={a.id} to={`/article/${a.slug || a.id}`} className="group cursor-pointer">
                  <span className="text-3xl font-serif text-gray-100 group-hover:text-black transition-colors block mb-2">0{i+1}</span>
                  <h5 className="font-bold text-sm leading-tight group-hover:underline">{a.title}</h5>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Input (AI Search) */}
        <section className="mb-24 bg-black text-white p-12 sm:p-20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[#ff4d00] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">AI Search</span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal leading-none mb-8 italic">Cut through the noise.</h2>
            <form onSubmit={handleSearch} className="relative flex items-center border-b border-white/20 focus-within:border-white transition-colors">
              <input
                type="text"
                placeholder="Enter a topic to explore..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-6 text-xl sm:text-3xl outline-none placeholder:text-white/20 font-light"
              />
              <button type="submit" className="ml-4 hover:text-[#ff4d00] transition-colors">
                {isSearching ? '...' : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </button>
            </form>
          </div>

          {aiSearchResults && (
            <div className="mt-12 pt-12 border-t border-white/10 animate-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                   <div className="prose prose-invert prose-lg max-w-none text-white/70 font-light">
                      {aiSearchResults.text.split('\n').map((para, i) => <p key={i} className="mb-4">{para}</p>)}
                   </div>
                </div>
                <div className="lg:col-span-4">
                  <h6 className="text-[10px] font-black uppercase tracking-widest text-[#ff4d00] mb-6">Sources</h6>
                  <div className="flex flex-col gap-4">
                    {aiSearchResults.sources?.map((s: any, idx: number) => (
                      s.web && (
                        <a key={idx} href={s.web.uri} target="_blank" rel="noopener" className="text-xs text-white/40 hover:text-white border-b border-white/5 pb-2 transition-colors">
                          {s.web.title}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Feed Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-12 border-b-2 border-black pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Latest Articles</h2>
              <div className="flex gap-6 overflow-x-auto no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'text-[#ff4d00]' : 'text-gray-400 hover:text-black'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading articles...</div>
            ) : (
              <div className="flex flex-col">
                {articles.map(article => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug || article.id}`}
                    className="group cursor-pointer flex gap-6 py-8 border-b border-gray-200 last:border-0 hover:px-2 transition-all"
                  >
                    <div className="flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#ff4d00] mb-2 block">{article.category}</span>
                      <h3 className="font-serif text-2xl leading-tight mb-2 group-hover:underline decoration-1">{article.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase">
                        <span>{article.author?.name || 'Staff'}</span>
                        <span>&middot;</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden flex-shrink-0">
                      <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/category/all"
              className="mt-16 text-xs font-black uppercase tracking-[0.4em] border-2 border-black py-5 px-10 hover:bg-black hover:text-white transition-all inline-block"
            >
              View All Articles
            </Link>
          </div>

          <aside className="lg:col-span-4">
            <Sidebar />
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
};
