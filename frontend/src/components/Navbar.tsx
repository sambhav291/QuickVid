"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const getInitials = (email: string): string => {
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getDisplayName = (email: string): string => {
  const name = email.split('@')[0];
  return name.split(/[._-]/).map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ');
};

export default function Navbar() {
  const router = useRouter();
  const { session, setShowAuthModal } = useAppContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    router.push('/');
  };

  const navigateTo = (path: string) => {
    if (path === '/summaries' && !session) {
      setShowAuthModal(true);
    } else {
      router.push(path);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/80 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <img
                  src="/QuickVid%20logo.png"
                  alt="QuickVid Logo"
                  className="relative h-12 w-12 rounded-full object-cover border-2 border-blue-400/50 shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-wider gradient-text">QuickVid</span>
                <span className="text-xs text-blue-300/70 tracking-wide">AI Summarizer</span>
              </div>
            </button>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => router.push('/')} 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border border-transparent hover:border-blue-500/30"
              >
                <HomeIcon /> Home
              </button>
              <button 
                onClick={() => navigateTo('/summaries')} 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border border-transparent hover:border-blue-500/30"
              >
                <BookmarkIcon /> Summaries
              </button>
              <button 
                onClick={() => router.push('/about')} 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border border-transparent hover:border-blue-500/30"
              >
                <InfoIcon /> About
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)} 
                  className="flex items-center gap-2 hover:bg-blue-500/10 rounded-lg px-3 py-2 transition-all border border-transparent hover:border-blue-500/30"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                    {getInitials(session.user.email || 'User')}
                  </div>
                  <span className="text-gray-300 text-sm font-medium hidden sm:block max-w-[120px] truncate">
                    {getDisplayName(session.user.email || 'User')}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl glass-card border border-blue-500/30 overflow-hidden fade-in">
                    <div className="p-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Signed in as</p>
                      <p className="text-sm text-white font-semibold truncate" title={session.user.email}>
                        {session.user.email}
                      </p>
                    </div>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-blue-500/10 flex items-center gap-2 transition-all"
                    >
                      <LogOutIcon /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="text-gray-300 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="btn-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 fade-in">
            <div className="glass-card rounded-xl p-2 space-y-1">
              <button 
                onClick={() => { router.push('/'); setMobileMenuOpen(false); }} 
                className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg px-4 py-3 text-sm font-medium transition-all border border-transparent hover:border-blue-500/30"
              >
                <HomeIcon /> Home
              </button>
              <button 
                onClick={() => { navigateTo('/summaries'); setMobileMenuOpen(false); }} 
                className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg px-4 py-3 text-sm font-medium transition-all border border-transparent hover:border-blue-500/30"
              >
                <BookmarkIcon /> My Summaries
              </button>
              <button 
                onClick={() => { router.push('/about'); setMobileMenuOpen(false); }} 
                className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg px-4 py-3 text-sm font-medium transition-all border border-transparent hover:border-blue-500/30"
              >
                <InfoIcon /> About
              </button>
              
              {!session && (
                <div className="pt-2 border-t border-blue-500/20 space-y-2">
                  <button 
                    onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} 
                    className="w-full text-gray-300 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} 
                    className="w-full btn-primary text-white px-4 py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}







