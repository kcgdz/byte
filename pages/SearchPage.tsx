
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../constants';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ');

    return MOCK_ARTICLES.filter(article => {
      const searchableText = `${article.title} ${article.excerpt} ${article.content} ${article.category} ${article.author.name} ${article.tags?.join(' ') || ''}`.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
        {/* Search Header */}
        <div className="mb-16 pb-12 border-b-2 border-black">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">Search Results</span>
          <h1 className="font-serif text-5xl sm:text-6xl font-normal mb-4">"{query}"</h1>
          <p className="text-xl text-gray-500">{results.length} results found</p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="max-w-4xl">
            {results.map(article => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="group flex gap-6 py-8 border-b border-gray-200 last:border-0 hover:px-2 transition-all"
              >
                <div className="flex-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#ff4d00] mb-2 block">
                    {article.category}
                  </span>
                  <h3 className="font-serif text-2xl leading-tight mb-2 group-hover:underline decoration-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase">
                    <span>{article.author.name}</span>
                    <span>&middot;</span>
                    <span>{article.date}</span>
                    <span>&middot;</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <div className="w-32 h-32 overflow-hidden flex-shrink-0 hidden sm:block">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No results found matching your search.</p>
            <Link to="/" className="text-[#ff4d00] hover:underline">Back to home</Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
