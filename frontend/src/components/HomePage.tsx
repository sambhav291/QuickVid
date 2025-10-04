"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function HomePage() {
  const router = useRouter();
  const { session, currentSummary, setCurrentSummary, setShowAuthModal } = useAppContext();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setCurrentSummary(null);
    
    try {
      // Always generate summary without saving (no auth needed)
      const response = await axios.post('http://localhost:3000/summarizer', { url });
      
      const data = response.data;
      setCurrentSummary({ 
        video_url: data.video_url || url, 
        summary_text: data.summary_text || data.summary, 
        video_title: data.video_title || 'Your New Summary',
        saved: false // Never auto-save
      });
    } catch {
      setError('Failed to generate summary. The API might be down or rate-limited.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    
    // If already saved, just navigate to summaries
    if (currentSummary?.saved) {
      router.push('/summaries');
      return;
    }
    
    setIsSaving(true);
    try {
      const token = session.access_token;
      // Call the new /save endpoint
      await axios.post(
        'http://localhost:3000/summarizer/save', 
        { url: currentSummary?.video_url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update current summary to mark as saved
      if (currentSummary) {
        setCurrentSummary({ ...currentSummary, saved: true });
      }
      
      router.push('/summaries');
    } catch (error) {
      console.error("Failed to save summary:", error);
      alert("There was an error saving your summary.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Instantly Summarize Any YouTube Video
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Paste a video URL to get a concise summary powered by AI. Save your summaries and build your knowledge library.
          </p>
          
          <form onSubmit={handleSummarize}>
            <input 
              type="url" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              placeholder="Enter YouTube URL..." 
              required 
              className="w-full p-4 rounded-md bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm" 
            />
            <button 
              type="submit" 
              disabled={isLoading || isSaving} 
              className="mt-4 w-full p-4 rounded-md bg-blue-600 hover:bg-blue-700 font-bold text-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Generate Summary'}
            </button>
          </form>
          
          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          
          {currentSummary && (
            <div className="mt-8 p-6 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700 animate-fade-in relative">
              {/* Close Button */}
              <button
                onClick={() => setCurrentSummary(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                aria-label="Close summary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h3 className="font-bold text-xl mb-2 pr-8">{currentSummary.video_title}</h3>
              <div className="prose prose-invert prose-sm max-w-none mb-4">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-3 text-white">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold mt-5 mb-2 text-white">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">{children}</h3>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-3 text-gray-300">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-3 text-gray-300">{children}</ol>,
                    li: ({children}) => <li className="ml-4 text-gray-300">{children}</li>,
                    p: ({children}) => <p className="my-2 text-gray-300 leading-relaxed">{children}</p>,
                    strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                    code: ({children}) => <code className="bg-gray-700 px-1 py-0.5 rounded text-sm text-blue-300">{children}</code>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-3">{children}</blockquote>,
                  }}
                >
                  {currentSummary.summary_text}
                </ReactMarkdown>
              </div>
              {currentSummary.saved ? (
                <button 
                  onClick={() => router.push('/summaries')} 
                  className="w-full p-3 rounded-md bg-blue-600 hover:bg-blue-700 font-bold"
                >
                  View in My Summaries
                </button>
              ) : (
                <button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="w-full p-3 rounded-md bg-green-600 hover:bg-green-700 font-bold disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : (session ? 'Save to My Summaries' : 'Sign In to Save')}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center justify-center h-full" />
      </div>
      
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
