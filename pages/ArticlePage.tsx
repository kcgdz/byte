
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../constants';
import { Comment } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = MOCK_ARTICLES.find(a => a.slug === slug);
  const currentIndex = MOCK_ARTICLES.findIndex(a => a.slug === slug);

  const [readingProgress, setReadingProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Extract headings for TOC
  const tableOfContents = useMemo(() => {
    if (!article) return [];
    const headings: { id: string; title: string; level: number }[] = [];
    article.content.split('\n').forEach((line, index) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '');
        headings.push({ id: `section-${index}`, title, level: 2 });
      } else if (line.startsWith('### ')) {
        const title = line.replace('### ', '');
        headings.push({ id: `section-${index}`, title, level: 3 });
      }
    });
    return headings;
  }, [article]);

  // Extract pull quote from content
  const pullQuote = useMemo(() => {
    if (!article) return null;
    const sentences = article.content.split(/[.!?]/).filter(s => s.trim().length > 50 && s.trim().length < 150);
    if (sentences.length > 0) {
      return sentences[Math.floor(sentences.length / 2)].trim() + '.';
    }
    return null;
  }, [article]);

  // Get prev/next articles
  const prevArticle = currentIndex > 0 ? MOCK_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < MOCK_ARTICLES.length - 1 ? MOCK_ARTICLES[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!article) return;

    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setIsSaved(savedArticles.includes(article.slug));

    const savedComments = JSON.parse(localStorage.getItem(`comments_${article.slug}`) || '[]');
    setComments(savedComments);

    // Load likes
    const likes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    setLikeCount(likes[article.slug]?.count || Math.floor(Math.random() * 50) + 10);
    setIsLiked(likes[article.slug]?.liked || false);
  }, [slug, article]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));

      // Calculate remaining time
      if (article) {
        const totalMinutes = parseInt(article.readTime);
        const remainingMinutes = Math.ceil(totalMinutes * (1 - progress / 100));
        if (remainingMinutes <= 0) {
          setRemainingTime('Complete');
        } else if (remainingMinutes === 1) {
          setRemainingTime('1 min left');
        } else {
          setRemainingTime(`${remainingMinutes} min left`);
        }
      }

      // Update active section for TOC
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const handleSave = () => {
    if (!article) return;
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    if (isSaved) {
      const filtered = savedArticles.filter((slug: string) => slug !== article.slug);
      localStorage.setItem('savedArticles', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      savedArticles.push(article.slug);
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      setIsSaved(true);
    }
  };

  const handleLike = () => {
    if (!article) return;
    const likes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    const newLiked = !isLiked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    likes[article.slug] = { count: newCount, liked: newLiked };
    localStorage.setItem('articleLikes', JSON.stringify(likes));

    setIsLiked(newLiked);
    setLikeCount(newCount);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !newComment.trim() || !commentAuthor.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: commentAuthor,
      content: newComment,
      date: new Date().toLocaleDateString('en-US'),
      articleId: article.slug
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${article.slug}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl mb-4">Article not found</h1>
            <Link to="/" className="text-[#ff4d00] hover:underline">Back to home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedArticles = MOCK_ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  const renderContent = (content: string) => {
    let sectionIndex = 0;
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        const sectionId = `section-${index}`;
        return (
          <h2
            key={index}
            id={sectionId}
            data-section
            className="text-3xl font-serif font-normal mt-12 mb-6 scroll-mt-24"
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        const sectionId = `section-${index}`;
        return (
          <h3
            key={index}
            id={sectionId}
            data-section
            className="text-xl font-bold mt-8 mb-4 scroll-mt-24"
          >
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
        if (match) {
          return (
            <p key={index} className="mb-2 pl-4">
              <span className="text-[#ff4d00]">•</span> <strong>{match[1]}</strong>: {match[2]}
            </p>
          );
        }
      }
      if (line.startsWith('- ')) {
        return (
          <p key={index} className="mb-2 pl-4">
            <span className="text-[#ff4d00]">•</span> {line.replace('- ', '')}
          </p>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <p key={index} className="mb-2 pl-4">
            <span className="font-bold text-[#ff4d00]">{line.charAt(0)}.</span> {line.substring(3)}
          </p>
        );
      }
      if (line.startsWith('|')) {
        return null;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      return <p key={index} className="mb-6 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-[200]">
        <div
          className="h-full bg-[#ff4d00] transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Header />

      <main className="pt-32 max-w-[1440px] mx-auto px-6 sm:px-12 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${article.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-black">
            {article.category}
          </Link>
        </nav>

        <article className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <header className="mb-12">
              <span className="text-[#ff4d00] font-black text-xs uppercase tracking-[0.4em] mb-6 block">
                {article.category}
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl leading-[0.9] font-normal mb-8">
                {article.title}
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-6 pt-8 border-t border-gray-100">
                <Link to={`/author/${article.author.id}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-[#ff4d00] transition-colors">
                    {article.author.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase group-hover:text-[#ff4d00] transition-colors">{article.author.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">{article.date} &middot; {article.readTime} READ</div>
                  </div>
                </Link>
              </div>
            </header>

            <img
              src={article.imageUrl}
              className="w-full aspect-video object-cover mb-12"
              alt={article.title}
            />

            {/* Action Bar with Like Button and Remaining Time */}
            <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-12">
              <div className="flex items-center gap-6">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {likeCount}
                </button>

                <button
                  onClick={() => setShowShareMenu(true)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#ff4d00] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isSaved ? 'text-[#ff4d00]' : 'hover:text-[#ff4d00]'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Tags + Remaining Time */}
              <div className="hidden sm:flex items-center gap-3">
                {article.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-2">
                    #{tag}
                  </span>
                ))}
                <span className="text-[9px] font-mono text-white bg-black px-3 py-2">
                  {remainingTime || article.readTime}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-neutral max-w-none text-gray-800 text-lg leading-[1.8] font-light">
              {renderContent(article.content.split('\n').slice(0, Math.floor(article.content.split('\n').length / 2)).join('\n'))}

              {/* Pull Quote */}
              {pullQuote && (
                <blockquote className="my-16 py-8 border-l-4 border-[#ff4d00] pl-8 bg-gray-50 -mx-4 px-8">
                  <p className="font-serif text-3xl sm:text-4xl leading-tight text-black italic m-0">
                    "{pullQuote}"
                  </p>
                </blockquote>
              )}

              {renderContent(article.content.split('\n').slice(Math.floor(article.content.split('\n').length / 2)).join('\n'))}
            </div>

            {/* Author Box */}
            <div className="mt-16 p-8 bg-gray-50 border border-gray-100">
              <Link to={`/author/${article.author.id}`} className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:bg-[#ff4d00] transition-colors flex-shrink-0">
                  {article.author.initials}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Author</div>
                  <div className="text-xl font-bold mb-2 group-hover:text-[#ff4d00] transition-colors">{article.author.name}</div>
                  <p className="text-sm text-gray-500">{article.author.bio}</p>
                </div>
              </Link>
            </div>

            {/* Prev/Next Navigation */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  to={`/article/${prevArticle.slug}`}
                  className="group p-6 border border-gray-200 hover:border-black transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    ← Previous Article
                  </span>
                  <h4 className="font-serif text-xl leading-tight group-hover:text-[#ff4d00] transition-colors">
                    {prevArticle.title}
                  </h4>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link
                  to={`/article/${nextArticle.slug}`}
                  className="group p-6 border border-gray-200 hover:border-black transition-colors text-right"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    Next Article →
                  </span>
                  <h4 className="font-serif text-xl leading-tight group-hover:text-[#ff4d00] transition-colors">
                    {nextArticle.title}
                  </h4>
                </Link>
              ) : <div />}
            </div>

            {/* Comments Section */}
            <div className="mt-16 pt-12 border-t border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8">Comments ({comments.length})</h3>

              {/* Comment Form */}
              <form onSubmit={handleAddComment} className="mb-12 p-6 bg-gray-50 border border-gray-100">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="Your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none h-32"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white text-[10px] font-black uppercase tracking-widest py-4 px-8 hover:bg-[#ff4d00] transition-colors"
                >
                  Submit Comment
                </button>
              </form>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm">No comments yet. Be the first to comment.</p>
              ) : (
                <div className="space-y-8">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-100 pb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-sm">{comment.author}</span>
                          <span className="text-gray-400 text-xs ml-2">{comment.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 pl-11">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-6 border-b-2 border-black pb-4">Table of Contents</h4>
                  <nav className="space-y-3">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block text-left text-sm transition-colors w-full ${
                          item.level === 3 ? 'pl-4 text-gray-400' : ''
                        } ${
                          activeSection === item.id
                            ? 'text-[#ff4d00] font-bold'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 border-b-2 border-black pb-4">Related Articles</h4>
                  <div className="space-y-8">
                    {relatedArticles.map(related => (
                      <Link
                        key={related.id}
                        to={`/article/${related.slug}`}
                        className="group block"
                      >
                        <div className="aspect-video overflow-hidden mb-4">
                          <img
                            src={related.imageUrl}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h5 className="font-serif text-xl leading-tight group-hover:text-[#ff4d00] transition-colors">
                          {related.title}
                        </h5>
                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 block">
                          {related.readTime}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="border-t-4 border-black pt-8">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4">Weekly Newsletter</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Get the most critical tech insights delivered to your inbox.
                </p>
                <form className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="border-b border-gray-200 py-4 text-sm outline-none focus:border-black transition-colors bg-transparent"
                  />
                  <button className="bg-black text-white text-[10px] font-black uppercase tracking-widest py-4 hover:bg-[#ff4d00] transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </article>
      </main>

      <Footer />

      {/* Share Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowShareMenu(false)}
          />
          <div className="relative bg-white w-full max-w-md p-8 animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setShowShareMenu(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff4d00] mb-2 block">Share</span>
              <h3 className="font-serif text-2xl">Share this article</h3>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-3 p-4 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center gap-3 p-4 border border-gray-200 hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-3 p-4 border border-gray-200 hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className={`flex items-center justify-center gap-3 p-4 border transition-all ${linkCopied ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 hover:border-[#ff4d00] hover:bg-[#ff4d00] hover:text-white'}`}
              >
                {linkCopied ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
                <span className="text-xs font-bold uppercase tracking-widest">{linkCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* URL Display */}
            <div className="bg-gray-50 p-4 border border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Article Link</p>
              <p className="text-sm text-gray-600 truncate font-mono">{typeof window !== 'undefined' ? window.location.href : ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
