
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navCategories = CATEGORIES.filter(c => c.id !== 'all').slice(0, 5);

  return (
    <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-white/90 backdrop-blur-md py-3' : 'bg-white py-6 border-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="font-serif text-4xl font-normal tracking-tighter">
            byte<span className="text-[#ff4d00]">.</span>
          </Link>
          <nav className="hidden xl:flex items-center gap-8">
            {navCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="text-[10px] font-black uppercase tracking-widest hover:text-[#ff4d00] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="border-b border-black py-1 px-2 text-sm outline-none w-48"
                autoFocus
              />
              <button type="submit" className="p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
