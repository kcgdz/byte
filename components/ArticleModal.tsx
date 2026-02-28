
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { getArticleSummary } from '../services/geminiService';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!article) {
      setSummary(null);
      setIsSummarizing(false);
      setReadingProgress(0);
    }
  }, [article]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setReadingProgress(progress);
  };

  const handleSummarize = async () => {
    if (!article) return;
    setIsSummarizing(true);
    const result = await getArticleSummary(article.title, article.excerpt);
    setSummary(result || "Summary not available.");
    setIsSummarizing(false);
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div 
        onScroll={handleScroll}
        className="relative bg-white w-full max-w-3xl h-full overflow-y-auto shadow-2xl animate-slide-up no-scrollbar"
      >
        {/* Progress Bar */}
        <div className="fixed top-0 right-0 w-full max-w-3xl h-1 bg-gray-100 z-50">
          <div className="h-full bg-[#ff4d00] transition-all duration-100" style={{ width: `${readingProgress}%` }}></div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-gray-100 z-40">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Go Back</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[10px] font-bold uppercase tracking-widest hover:text-[#ff4d00]">Share</button>
            <button className="text-[10px] font-bold uppercase tracking-widest hover:text-[#ff4d00]">Save</button>
          </div>
        </div>

        <div className="p-8 sm:p-16">
          <header className="mb-12">
            <span className="text-[#ff4d00] font-black text-xs uppercase tracking-[0.4em] mb-6 block">
              {article.category}
            </span>
            <h2 className="font-serif text-5xl sm:text-7xl leading-[0.9] font-normal mb-8">
              {article.title}
            </h2>
            <div className="flex items-center gap-6 pt-8 border-t border-gray-100">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                {article.author.initials}
              </div>
              <div>
                <div className="text-sm font-bold uppercase">{article.author.name}</div>
                <div className="text-[10px] font-mono text-gray-400">{article.date} &middot; {article.readTime} READ</div>
              </div>
            </div>
          </header>

          <img src={article.imageUrl} className="w-full aspect-video object-cover mb-12 grayscale hover:grayscale-0 transition-all duration-700" alt={article.title} />

          <div className="max-w-xl mx-auto">
            {/* AI Insight Box - Minimalist Version */}
            <div className="mb-12 p-8 border border-black bg-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[8px] font-bold bg-black text-white uppercase tracking-tighter">AI INSIGHT</div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Editor's Note / Summary</h4>
              {!summary ? (
                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="text-sm font-bold underline hover:text-[#ff4d00] disabled:opacity-30"
                >
                  {isSummarizing ? "Analyzing..." : "Get the key takeaways in 30 seconds →"}
                </button>
              ) : (
                <div className="text-sm leading-relaxed text-gray-700 space-y-3">
                  {summary.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} className="flex gap-3">
                      <span className="text-[#ff4d00]">•</span>
                      {line.replace(/^[*-]\s*/, '')}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-neutral max-w-none text-gray-800 text-lg sm:text-xl leading-[1.7] font-light">
              <p className="font-medium text-2xl leading-relaxed mb-8 text-black">
                {article.excerpt}
              </p>
              <p className="mb-8">
                In today's technology landscape, change is no longer linear but exponential. Not just devices, but the emotional and functional connections we build with them are being redefined.
              </p>
              <p className="mb-8 italic font-serif text-3xl border-l-2 border-[#ff4d00] pl-8 my-12 text-black leading-tight">
                "The future is being shaped by those who code it today."
              </p>
              <p>
                Technology has evolved from being a tool to becoming an extension of ourselves. Apple's new vision or SpaceX's Mars goals aren't just business moves; they're the opening act of a new chapter in human history. The engineering marvels and philosophical debates behind this curtain will define the next decade.
              </p>
            </div>

            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col gap-8">
              <h5 className="text-xs font-black uppercase tracking-widest">Comments / 0</h5>
              <div className="bg-gray-50 p-6 border border-gray-100">
                <p className="text-xs text-gray-400 mb-4">No comments yet. Be the first to comment.</p>
                <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black">Write Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
