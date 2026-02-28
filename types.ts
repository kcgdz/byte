
export interface Author {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  bio?: string;
  role?: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  imageUrl: string;
  isTrending?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  articleId: string;
}

export interface SavedArticle {
  id: string;
  savedAt: string;
}
