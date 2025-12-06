// @ts-nocheck
import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type FeedbackCategory = 'bug'|'suggestion'|'other';

export type FeedbackPayload = {
  category: FeedbackCategory;
  title: string; 
  description: string;
  include_diagnostics?: boolean;
  diagnostics?: Record<string, unknown>;
  screenshot_base64?: string;
};

export type FeedbackResp = { 
  ticket_id: string; 
  status_url?: string; 
};

type FeedbackState = {
  isOpen: boolean;
  draft: Partial<FeedbackPayload>;
  loading: boolean;
  lastTicket?: {
    id: string;
    timestamp: number;
  };
  
  setOpen: (isOpen: boolean) => void;
  setDraft: (draft: Partial<FeedbackPayload>) => void;
  setLoading: (loading: boolean) => void;
  setLastTicket: (ticket: { id: string; timestamp: number }) => void;
  clearDraft: () => void;
};

const useFeedbackStoreBase = create<FeedbackState>()(
  persist(
    (set) => ({
      isOpen: false,
      draft: {
        category: 'bug',
        title: '',
        description: '',
        include_diagnostics: true
      },
      loading: false,
      
      setOpen: (isOpen) => set({ isOpen }),
      
      setDraft: (newDraft) => 
        set((state) => ({ 
          draft: { ...state.draft, ...newDraft } 
        })),
      
      setLoading: (loading) => set({ loading }),
      
      setLastTicket: (lastTicket) => set({ lastTicket }),
      
      clearDraft: () => set({
        draft: {
          category: 'bug',
          title: '',
          description: '',
          include_diagnostics: true
        }
      })
    }),
    {
      name: 'feedback-store',
      partialize: (state) => ({
        draft: state.draft,
        lastTicket: state.lastTicket
      })
    }
  )
);

export const useFeedbackStore = createSelectors(useFeedbackStoreBase);
