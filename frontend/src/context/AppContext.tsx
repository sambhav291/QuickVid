"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Summary {
  id?: string;
  video_url: string;
  summary_text: string;
  video_title: string;
  saved?: boolean;
  created_at?: string;
}

interface AppContextType {
  session: any;
  setSession: (session: any) => void;
  currentSummary: Summary | null;
  setCurrentSummary: (summary: Summary | null) => void;
  savedSummaries: Summary[];
  setSavedSummaries: (summaries: Summary[]) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<any>(null);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [savedSummaries, setSavedSummaries] = useState<Summary[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setShowAuthModal(false);
    });

    return () => listener?.subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <AppContext.Provider
      value={{
        session,
        setSession,
        currentSummary,
        setCurrentSummary,
        savedSummaries,
        setSavedSummaries,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
