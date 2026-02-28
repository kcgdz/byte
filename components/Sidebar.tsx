
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ARTICLES, CATEGORIES } from '../constants';

export const Sidebar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Store in localStorage
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }
      setSubscribed(true);
    }
  };

  // Get staff picks (featured articles)
  const staffPicks = MOCK_ARTICLES.filter(a => a.isTrending).slice(0, 3);

  // Get topics from categories
  const topics = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="flex flex-col gap-20 sticky top-32">
      {/* Newsletter */}
      <div className="border-t-4 border-black pt-8">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-6">Weekly Newsletter</h4>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Get the most important tech insights and weekly byte summaries delivered to your inbox.
        </p>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-gray-200 py-4 text-sm outline-none focus:border-black transition-colors bg-transparent"
              required
            />
            <button className="bg-black text-white text-[10px] font-black uppercase tracking-widest py-4 hover:bg-[#ff4d00] transition-colors">
              Subscribe
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 p-6 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-center">
            You're on the list.
          </div>
        )}
      </div>

      {/* Editor's Picks */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Editor's Picks</h4>
        <div className="flex flex-col gap-10">
          {staffPicks.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group cursor-pointer"
            >
              <h5 className="font-serif text-xl leading-tight group-hover:underline decoration-1 mb-2">
                {article.title}
              </h5>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                {article.category} &middot; {article.readTime}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Browse Topics</h4>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {topics.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              #{cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
