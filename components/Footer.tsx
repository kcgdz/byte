
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

export const Footer: React.FC = () => {
  const categoryLinks = CATEGORIES.filter(c => c.id !== 'all').slice(0, 4);

  return (
    <footer className="bg-white border-t border-gray-100 py-24">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 items-start">
          <div className="max-w-sm">
            <Link to="/" className="font-serif text-5xl font-normal tracking-tighter mb-8 block">
              byte<span className="text-[#ff4d00]">.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Your global technology authority. Cutting through the noise to help you understand the future today.
            </p>
            <div className="flex gap-5">
              <a href="https://github.com/kcgdz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff4d00] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div>
              <h6 className="text-[10px] font-black uppercase tracking-widest mb-6">Categories</h6>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                {categoryLinks.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.id}`} className="hover:text-black">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="text-[10px] font-black uppercase tracking-widest mb-6">About</h6>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-black">About Us</Link></li>
                <li><Link to="/team" className="hover:text-black">Team</Link></li>
                <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="text-[10px] font-black uppercase tracking-widest mb-6">Legal</h6>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-black">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-black">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-black">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-12 border-t border-gray-100 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          &copy; 2026 byte. Built by <a href="https://github.com/kcgdz" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff4d00] transition-colors">kcgdz</a>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
