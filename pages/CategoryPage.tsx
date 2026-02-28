
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, MOCK_ARTICLES } from '../constants';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const category = CATEGORIES.find(c => c.id === id);

  const categoryArticles = MOCK_ARTICLES.filter(article => {
    if (!category) return false;
    return article.category === category.name;
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl mb-4">Category not found</h1>
            <Link to="/" className="text-[#ff4d00] hover:underline">Back to home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
        {/* Category Header */}
        <div className="mb-16 pb-12 border-b-2 border-black">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff4d00] mb-4 block">Category</span>
          <h1 className="font-serif text-6xl sm:text-8xl font-normal mb-6">{category.name}</h1>
          <p className="text-xl text-gray-500 max-w-2xl">{category.description}</p>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar mb-16 pb-4 border-b border-gray-100">
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${cat.id === id ? 'text-[#ff4d00]' : 'text-gray-400 hover:text-black'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            {categoryArticles.length > 0 ? (
              <>
                {/* Featured Article */}
                {categoryArticles[0] && (
                  <Link
                    to={`/article/${categoryArticles[0].slug}`}
                    className="group block mb-16"
                  >
                    <div className="aspect-video overflow-hidden mb-8">
                      <img
                        src={categoryArticles[0].imageUrl}
                        alt={categoryArticles[0].title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff4d00] mb-3 block">
                      Featured
                    </span>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 group-hover:underline decoration-1">
                      {categoryArticles[0].title}
                    </h2>
                    <p className="text-lg text-gray-500 mb-6">{categoryArticles[0].excerpt}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {categoryArticles[0].author.initials}
                      </div>
                      <div className="text-sm">
                        <span className="font-bold">{categoryArticles[0].author.name}</span>
                        <span className="text-gray-400 mx-2">&middot;</span>
                        <span className="text-gray-400">{categoryArticles[0].readTime}</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Article List */}
                <div className="border-t-2 border-black pt-12">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">All Articles</h3>
                  <div className="space-y-0">
                    {categoryArticles.slice(1).map(article => (
                      <Link
                        key={article.id}
                        to={`/article/${article.slug}`}
                        className="group flex gap-6 py-8 border-b border-gray-200 last:border-0 hover:px-2 transition-all"
                      >
                        <div className="flex-1">
                          <h4 className="font-serif text-2xl leading-tight mb-2 group-hover:underline decoration-1">
                            {article.title}
                          </h4>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase">
                            <span>{article.author.name}</span>
                            <span>&middot;</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden flex-shrink-0">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No content in this category yet.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};
