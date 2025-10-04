"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { encryptSummary } from '@/utils/encryption';

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/summarizer`, { url });
      const data = response.data;
      setCurrentSummary({ 
        video_url: data.video_url || url, 
        summary_text: data.summary_text || data.summary, 
        video_title: data.video_title || 'Your New Summary',
        saved: false
      });
    } catch {
      setError('Failed to generate summary. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    
    if (currentSummary?.saved) {
      router.push('/summaries');
      return;
    }
    
    setIsSaving(true);
    try {
      const token = session.access_token;
      
      // Encrypt the summary before sending to backend
      const encryptedData = await encryptSummary(
        {
          video_url: currentSummary?.video_url || '',
          summary_text: currentSummary?.summary_text || '',
          video_title: currentSummary?.video_title || 'Untitled',
        },
        session.user.id
      );
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      await axios.post(
        `${API_URL}/summarizer/save`, 
        { 
          url: currentSummary?.video_url,
          encrypted_summary: encryptedData.summary_text,
          encrypted_title: encryptedData.video_title,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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
    <div className="relative pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 fade-in">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-blue-300 border border-blue-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Powered by Advanced AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="gradient-text glow-text">Transform Videos</span>
            <br />
            <span className="text-white">Into Knowledge</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of video learning. Get AI-powered summaries of any YouTube video in seconds. 
            Save time, learn faster, and build your personal knowledge library.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-16 slide-in">
          <form onSubmit={handleSummarize} className="relative">
            <div className="glass-card rounded-2xl p-2 glow-effect">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="url" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  placeholder="Paste YouTube URL here..." 
                  required 
                  className="flex-1 px-6 py-4 rounded-xl bg-gray-800/50 border border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 focus:outline-none text-white placeholder-gray-400 transition-all" 
                />
                <button 
                  type="submit" 
                  disabled={isLoading || isSaving} 
                  className="btn-primary px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/30 whitespace-nowrap"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="loading-spinner" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Summarize
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-center fade-in flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Summary Display */}
        {currentSummary && (
          <div className="max-w-4xl mx-auto fade-in">
            <div className="glass-card rounded-2xl p-8 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              
              <button
                onClick={() => setCurrentSummary(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all p-2 hover:bg-blue-500/20 rounded-lg z-10"
                aria-label="Close summary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-bold text-2xl mb-2 text-white">{currentSummary.video_title}</h3>
                    <a 
                      href={currentSummary.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
                
                <div className="prose prose-invert prose-lg max-w-none mb-6 p-6 bg-gray-900/30 rounded-xl border border-blue-500/10">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-3 text-white gradient-text">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold mt-5 mb-2 text-blue-200">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-100">{children}</h3>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-2 my-3 text-gray-200">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside space-y-2 my-3 text-gray-200">{children}</ol>,
                      li: ({children}) => <li className="ml-4 text-gray-200 leading-relaxed">{children}</li>,
                      p: ({children}) => <p className="my-3 text-gray-200 leading-relaxed">{children}</p>,
                      strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                      em: ({children}) => <em className="italic text-blue-200">{children}</em>,
                      code: ({children}) => <code className="bg-blue-500/20 px-2 py-1 rounded text-sm text-blue-300 border border-blue-500/30">{children}</code>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-3 bg-blue-500/5 py-2">{children}</blockquote>,
                    }}
                  >
                    {currentSummary.summary_text}
                  </ReactMarkdown>
                </div>
                
                <div className="flex gap-3">
                  {currentSummary.saved ? (
                    <button 
                      onClick={() => router.push('/summaries')} 
                      className="flex-1 btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      View in My Summaries
                    </button>
                  ) : (
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving} 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="loading-spinner" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {session ? 'Save to My Library' : 'Sign In to Save'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!currentSummary && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
            <div className="glass-card p-6 rounded-xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Lightning Fast</h3>
              <p className="text-gray-400">Get comprehensive summaries in seconds with our advanced AI processing engine.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Secure & Private</h3>
              <p className="text-gray-400">Your data is encrypted and never shared. We respect your privacy completely.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Smart Learning</h3>
              <p className="text-gray-400">Build your personal knowledge library with organized, searchable summaries.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




