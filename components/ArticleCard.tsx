
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'featured' | 'standard';
  onClick: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard', onClick }) => {
  if (variant === 'hero') {
    return (
      <div 
        onClick={() => onClick(article.id)}
        className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 border-base overflow-hidden"
      >
        <div className="lg:col-span-8 overflow-hidden aspect-video lg:aspect-auto">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
          />
        </div>
        <div className="lg:col-span-4 p-8 sm:p-12 flex flex-col justify-center bg-white border-l-0 lg:border-l border-base">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff4d00] mb-6 block">
            {article.category}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl leading-[0.95] font-normal mb-6 group-hover:underline decoration-1 underline-offset-4">
            {article.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
            <span className="text-xs font-bold uppercase">{article.author.name}</span>
            <span className="text-[10px] font-mono text-gray-400">{article.readTime} READ</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div 
        onClick={() => onClick(article.id)}
        className="group cursor-pointer flex flex-col border-base p-6 hover:bg-gray-50 transition-colors h-full"
      >
        <div className="aspect-[4/3] overflow-hidden mb-6">
          <img src={article.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{article.category}</span>
        <h3 className="font-serif text-3xl leading-[1.1] mb-4 group-hover:text-[#ff4d00] transition-colors">{article.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-6">{article.excerpt}</p>
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold">
          <span className="uppercase">{article.author.name}</span>
          <span className="text-gray-400">{article.date}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(article.id)}
      className="group cursor-pointer flex gap-6 py-8 border-b border-gray-200 last:border-0 hover:px-2 transition-all"
    >
      <div className="flex-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#ff4d00] mb-2 block">{article.category}</span>
        <h3 className="font-serif text-2xl leading-tight mb-2 group-hover:underline decoration-1">{article.title}</h3>
        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase">
          <span>{article.author.name}</span>
          <span>&middot;</span>
          <span>{article.readTime}</span>
        </div>
      </div>
      <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden flex-shrink-0">
        <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
    </div>
  );
};
