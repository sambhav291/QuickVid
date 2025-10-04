"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Define the summary interface to match what comes from the API
interface SummaryItem {
  id?: string;
  video_url: string;
  video_title: string;
  summary_text: string;
  created_at?: string;
}

// Component for individual summary card with expand/collapse
function SummaryCard({ summary, onDelete }: { summary: SummaryItem; onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get preview text (first 300 characters)
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
    <div className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700 hover:border-gray-600 transition-colors relative">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Delete summary"
        title="Delete summary"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      
      <h3 className="font-bold text-lg mb-2 pr-10">{summary.video_title || 'No Title'}</h3>
      <a 
        href={summary.video_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-blue-400 hover:underline break-all inline-block mb-3"
      >
        {summary.video_url}
      </a>
      
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h1>,
            h2: ({children}) => <h2 className="text-lg font-bold mt-3 mb-2 text-white">{children}</h2>,
            h3: ({children}) => <h3 className="text-base font-semibold mt-3 mb-1 text-gray-200">{children}</h3>,
            ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-300">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2 text-gray-300">{children}</ol>,
            li: ({children}) => <li className="ml-4 text-gray-300">{children}</li>,
            p: ({children}) => <p className="my-1.5 text-gray-300 leading-relaxed">{children}</p>,
            strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
            em: ({children}) => <em className="italic text-gray-200">{children}</em>,
            code: ({children}) => <code className="bg-gray-700 px-1 py-0.5 rounded text-sm text-blue-300">{children}</code>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-2">{children}</blockquote>,
          }}
        >
          {isExpanded ? summary.summary_text : previewText + (needsExpansion ? '...' : '')}
        </ReactMarkdown>
      </div>
      
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1 transition-colors"
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
      
      {summary.created_at && (
        <p className="mt-3 text-xs text-gray-500 border-t border-gray-700 pt-3">
          {new Date(summary.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      )}
    </div>
  );
}

export default function SummariesPage() {
  const { session, savedSummaries, setSavedSummaries } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummaries = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/summarizer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedSummaries(response.data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setSavedSummaries]);

  const handleDelete = async (id: string) => {
    if (!session) return;
    
    try {
      await axios.delete(`http://localhost:3000/summarizer/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      
      // Remove from local state
      setSavedSummaries(savedSummaries.filter(summary => summary.id !== id));
    } catch (error) {
      console.error("Error deleting summary:", error);
      throw error; // Re-throw to be caught by SummaryCard
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
      <div className="pt-32 text-center text-gray-400">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4">Loading your summaries...</p>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="pt-32 text-center text-gray-400">
        <p>Please sign in to view your saved summaries.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
      <h1 className="text-4xl font-bold mb-8">My Saved Summaries</h1>
      <div className="space-y-4">
        {savedSummaries.length > 0 ? (
          savedSummaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} onDelete={handleDelete} />
          ))
        ) : (
          <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50">
            <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>You haven&apos;t saved any summaries yet.</p>
            <p className="text-sm mt-2">Go to the Home page to generate your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
