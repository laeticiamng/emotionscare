import { create } from 'zustand';

export type Section = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  section: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  html: string;
  updated_at: string;
  section: string;
};

export type Feedback = {
  slug: string;
  helpful: boolean;
  comment?: string;
};

interface HelpState {
  sections: Section[];
  articles: ArticleSummary[];
  currentArticle: Article | null;
  searchResults: ArticleSummary[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  setSections: (sections: Section[]) => void;
  setArticles: (articles: ArticleSummary[]) => void;
  setCurrentArticle: (article: Article | null) => void;
  setSearchResults: (results: ArticleSummary[]) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  sections: [],
  articles: [],
  currentArticle: null,
  searchResults: [],
  searchQuery: '',
  loading: false,
  error: null
};

export const useHelpStore = create<HelpState>((set) => ({
  ...initialState,
  
  setSections: (sections) => set({ sections }),
  setArticles: (articles) => set({ articles }),
  setCurrentArticle: (currentArticle) => set({ currentArticle }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState)
}));