
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AUTHORS, MOCK_ARTICLES } from '../constants';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const author = AUTHORS.find(a => a.id === id);
  const authorArticles = MOCK_ARTICLES.filter(a => a.author.id === id);

  if (!author) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl mb-4">Author not found</h1>
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
        {/* Author Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-8">
            {author.initials}
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-normal mb-4">{author.name}</h1>
          <p className="text-[#ff4d00] text-sm font-bold uppercase tracking-widest mb-8">{author.role}</p>
          <p className="text-xl text-gray-500 leading-relaxed mb-8">{author.bio}</p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <span><strong className="text-black">{authorArticles.length}</strong> Articles</span>
            <span>&middot;</span>
            <span>Uprsoft member since 2024</span>
          </div>
        </div>

        {/* Author Articles */}
        <div className="border-t-2 border-black pt-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-12">All Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorArticles.map(article => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="group"
              >
                <div className="aspect-video overflow-hidden mb-6">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff4d00] mb-2 block">
                  {article.category}
                </span>
                <h3 className="font-serif text-2xl leading-tight mb-3 group-hover:underline">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{article.excerpt}</p>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase">
                  <span>{article.date}</span>
                  <span>&middot;</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {authorArticles.length === 0 && (
            <p className="text-gray-400 text-center py-12">This author has no articles yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
