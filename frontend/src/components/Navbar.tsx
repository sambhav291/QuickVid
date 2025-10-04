"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

// Helper function to get user initials
const getInitials = (email: string): string => {
  const name = email.split('@')[0]; // Get part before @
  const parts = name.split(/[._-]/); // Split by common separators
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to get display name
const getDisplayName = (email: string): string => {
  const name = email.split('@')[0];
  // Capitalize first letter and replace separators with spaces
  return name.split(/[._-]/).map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ');
};

export default function Navbar() {
  const router = useRouter();
  const { session, setShowAuthModal } = useAppContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 flex-shrink-0 group">
              <img
                src="/QuickVid%20logo.png"
                alt="QuickVid Logo"
                className="h-10 w-10 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-all duration-200"
              />
              <span className="text-2xl font-bold tracking-wider text-white">QuickVid</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => router.push('/')} 
                className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                <HomeIcon /> Home
              </button>
              <button 
                onClick={() => navigateTo('/summaries')} 
                className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                <BookmarkIcon /> Saved Summaries
              </button>
              <button 
                onClick={() => router.push('/about')} 
                className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                <InfoIcon /> About
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)} 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {/* Profile Circle with Initials */}
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(session.user.email || 'User')}
                  </div>
                  {/* Display Name */}
                  <span className="text-gray-300 text-sm font-medium hidden sm:block">
                    {getDisplayName(session.user.email || 'User')}
                  </span>
                  {/* Dropdown Arrow */}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 border border-gray-700">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm text-gray-400 mb-1">Signed in as</p>
                        <p className="text-sm text-white font-medium truncate" title={session.user.email}>
                          {session.user.email}
                        </p>
                      </div>
                      <button 
                        onClick={handleSignOut} 
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <LogOutIcon /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
