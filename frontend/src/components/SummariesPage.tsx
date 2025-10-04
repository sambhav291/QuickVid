"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { decryptSummary } from '@/utils/encryption';
import Link from 'next/link';

interface SummaryItem {
  id?: string;
  video_url: string;
  video_title: string;
  summary_text: string;
  created_at?: string;
}

function SummaryCard({ summary, onDelete }: { summary: SummaryItem; onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const previewText = summary.summary_text.substring(0, 300);
  const needsExpansion = summary.summary_text.length > 300;
  
  const handleDelete = async () => {
    if (!summary.id) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this summary?');
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(summary.id);
    } catch (error) {
      console.error('Error deleting summary:', error);
      alert('Failed to delete summary');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="glass-card rounded-xl p-6 hover:border-blue-500/40 transition-all relative group overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Delete summary"
        title="Delete summary"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      
      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/30 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div className="flex-1 pr-10">
            <h3 className="font-bold text-lg mb-1 text-white line-clamp-2">{summary.video_title || 'No Title'}</h3>
            <a 
              href={summary.video_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Watch Video
            </a>
          </div>
        </div>
        
        <div className="prose prose-invert prose-sm max-w-none p-4 bg-gray-900/30 rounded-lg border border-blue-500/10">
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2 gradient-text">{children}</h1>,
              h2: ({children}) => <h2 className="text-lg font-bold mt-3 mb-2 text-blue-200">{children}</h2>,
              h3: ({children}) => <h3 className="text-base font-semibold mt-3 mb-1 text-blue-100">{children}</h3>,
              ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-200">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2 text-gray-200">{children}</ol>,
              li: ({children}) => <li className="ml-4 text-gray-200">{children}</li>,
              p: ({children}) => <p className="my-2 text-gray-200 leading-relaxed">{children}</p>,
              strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
              em: ({children}) => <em className="italic text-blue-200">{children}</em>,
              code: ({children}) => <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-sm text-blue-300 border border-blue-500/30">{children}</code>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2 bg-blue-500/5 py-1">{children}</blockquote>,
            }}
          >
            {isExpanded ? summary.summary_text : previewText + (needsExpansion ? '...' : '')}
          </ReactMarkdown>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-500/10">
          {summary.created_at && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(summary.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
              })}
            </div>
          )}
          
          {needsExpansion && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1 transition-all hover:gap-2"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Read More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SummariesPage() {
  const { session, savedSummaries, setSavedSummaries } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummaries = useCallback(async (token: string) => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_URL}/summarizer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Fetched summaries from backend:', response.data);
      
      // Decrypt all summaries (handles both encrypted and plaintext)
      const encryptedSummaries = response.data;
      const decryptedSummaries = await Promise.all(
        encryptedSummaries.map(async (summary: SummaryItem) => {
          try {
            const decrypted = await decryptSummary(summary, session.user.id);
            console.log('Decrypted summary:', { 
              id: summary.id, 
              title: decrypted.video_title.substring(0, 50) 
            });
            return decrypted;
          } catch (error) {
            console.error('Failed to decrypt summary:', summary.id, error);
            // Return the original summary if decryption fails (backward compatibility)
            return summary;
          }
        })
      );
      
      console.log('Total decrypted summaries:', decryptedSummaries.length);
      setSavedSummaries(decryptedSummaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setSavedSummaries, session]);

  const handleDelete = async (id: string) => {
    if (!session) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      await axios.delete(`${API_URL}/summarizer/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      
      setSavedSummaries(savedSummaries.filter(summary => summary.id !== id));
    } catch (error) {
      console.error("Error deleting summary:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (session) {
      fetchSummaries(session.access_token);
    } else {
      setIsLoading(false);
    }
  }, [session, fetchSummaries]);

  if (isLoading) {
    return (
      <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="loading-spinner mb-4" />
        <p className="text-gray-400">Loading your summaries...</p>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="glass-card p-12 rounded-2xl max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your saved summaries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 min-h-screen">
      <div className="mb-8 fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">My Library</h1>
            <p className="text-gray-400">Your personal collection of video summaries</p>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{savedSummaries.length}</div>
              <div className="text-xs text-gray-400">Summaries</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 fade-in">
        {savedSummaries.length > 0 ? (
          savedSummaries.map((summary, index) => (
            <div key={summary.id} style={{animationDelay: `${index * 0.1}s`}} className="slide-in">
              <SummaryCard summary={summary} onDelete={handleDelete} />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="glass-card p-12 rounded-2xl max-w-2xl mx-auto border-2 border-dashed border-blue-500/30">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">No Summaries Yet</h3>
              <p className="text-gray-400 mb-6">Start building your knowledge library by summarizing your first video!</p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Summary
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

