"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

// --- SVG Icons ---
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

// --- Vanta.js Background Component ---
function VantaBackground() {
  const vantaRef = useRef(null);
  useEffect(() => {
    // Declare VANTA types for TypeScript to avoid errors
    const declareVanta = () => {
      window.VANTA = window.VANTA || {};
    };
    declareVanta();

    let vantaEffect = null;
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    document.body.appendChild(threeScript);

    threeScript.onload = () => {
      const vantaScript = document.createElement("script");
      vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js";
      document.body.appendChild(vantaScript);

      vantaScript.onload = () => {
        if (vantaRef.current && window.VANTA && window.VANTA.HALO) {
          vantaEffect = window.VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0x0d1117,
            amplitudeFactor: 1.20,
            xOffset: 0.26,
            size: 1.5,
          });
        }
      };
    };

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}

// --- Main App Component ---
export default function App() {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState(null);
  const [page, setPage] = useState('home');
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
    <div className="min-h-screen text-white font-sans relative">
      <VantaBackground />
      <Navbar session={session} setPage={setPage} setShowAuthModal={setShowAuthModal} />
      <main>
        {page === 'home' && <HomePage session={session} setShowAuthModal={setShowAuthModal} setPage={setPage} />}
        {page === 'summaries' && <SummariesPage session={session} />}
        {page === 'about' && <AboutPage />}
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} supabase={supabase} />}
    </div>
  );
}

// --- Navigation Component ---
function Navbar({ session, setPage, setShowAuthModal }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const supabase = createClientComponentClient();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setPage('home')} className="flex-shrink-0 text-2xl font-bold tracking-wider">QuickVid</button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => setPage('home')} className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"><HomeIcon /> Home</button>
              <button onClick={() => { session ? setPage('summaries') : setShowAuthModal(true) }} className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"><BookmarkIcon /> Saved Summaries</button>
              <button onClick={() => setPage('about')} className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"><InfoIcon /> About</button>
            </div>
          </div>
          <div className="relative">
            {session ? (
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <img className="h-8 w-8 rounded-full" src={`https://api.dicebear.com/8.x/initials/svg?seed=${session.user.email}`} alt="User profile" />
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Sign In</button>
            )}
            {profileOpen && session && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">Signed in as<br/><strong className="truncate">{session.user.email}</strong></div>
                <button onClick={() => { supabase.auth.signOut(); setProfileOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"><LogOutIcon /> Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- Home Page Component ---
function HomePage({ session, setShowAuthModal, setPage }) {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSummary(null);
    try {
      const response = await axios.post('http://localhost:3000/summarizer', { url });
      setSummary({ video_url: url, summary_text: response.data.summary, video_title: 'Your New Summary' });
    } catch (err) {
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
    setIsSaving(true);
    try {
      const token = session.access_token;
      await axios.post(
        'http://localhost:3000/summarizer', 
        { url: summary.video_url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPage('summaries');
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
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Instantly Summarize Any YouTube Video</h1>
          <p className="text-lg text-gray-400 mb-8">Paste a video URL to get a concise summary powered by AI. Save your summaries and build your knowledge library.</p>
          <form onSubmit={handleSummarize}>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter YouTube URL..." required className="w-full p-4 rounded-md bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm" />
            <button type="submit" disabled={isLoading || isSaving} className="mt-4 w-full p-4 rounded-md bg-blue-600 hover:bg-blue-700 font-bold text-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isLoading ? 'Processing...' : 'Generate Summary'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          {summary && (
            <div className="mt-8 p-6 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700 animate-fade-in">
              <h3 className="font-bold text-xl mb-2">{summary.video_title}</h3>
              <p className="text-gray-300 mb-4">{summary.summary_text}</p>
              <button onClick={handleSave} disabled={isSaving} className="w-full p-3 rounded-md bg-green-600 hover:bg-green-700 font-bold disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isSaving ? 'Saving...' : (session ? 'Save to My Summaries' : 'Sign In to Save')}
              </button>
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

// --- Summaries Page Component ---
function SummariesPage({ session }) {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummaries = useCallback(async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/summarizer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummaries(response.data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchSummaries(session.access_token);
    } else {
      setIsLoading(false);
    }
  }, [session, fetchSummaries]);

  if (isLoading) {
    return <div className="pt-32 text-center text-gray-400">Loading your summaries...</div>;
  }
  
  if (!session) {
     return <div className="pt-32 text-center text-gray-400">Please sign in to view your saved summaries.</div>;
  }

  return (
    <div className="pt-24 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">My Saved Summaries</h1>
      <div className="space-y-4">
        {summaries.length > 0 ? (
          summaries.map((summary) => (
            <div key={summary.id} className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
              <h3 className="font-bold text-lg">{summary.video_title || 'No Title'}</h3>
              <a href={summary.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all">
                {summary.video_url}
              </a>
              <p className="mt-2 text-gray-300">{summary.summary_text}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50">
            <p>You haven't saved any summaries yet.</p>
            <p className="text-sm mt-2">Go to the Home page to generate your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- About Page Component ---
function AboutPage() {
  return (
    <div className="pt-24 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">About QuickVid</h1>
      <div className="prose prose-invert lg:prose-xl text-gray-300 space-y-4 bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
        <p>QuickVid is an AI-powered tool designed to save you time and help you learn faster. By leveraging state-of-the-art language models, we transform long YouTube videos into concise, easy-to-read summaries.</p>
        <p>This project was built with a modern, full-stack TypeScript architecture, utilizing Next.js for a reactive frontend, Nest.js for a robust backend, and Supabase for database and authentication services.</p>
        <p>Whether you're a student, a professional, or a lifelong learner, QuickVid helps you get the key insights from video content without spending hours watching.</p>
      </div>
    </div>
  );
}

// --- Auth Modal Component ---
function AuthModal({ onClose, supabase }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in">
      <div className="relative w-full max-w-md p-8 bg-gray-800 rounded-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={['google']}
            redirectTo="http://localhost:3001"
        />
      </div>
    </div>
  );
}







// "use client";

// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function AuthPage() {
//   const supabase = createClientComponentClient();
//   const [session, setSession] = useState(null);
//   const [summaries, setSummaries] = useState([]); // <-- New state for summaries

//   useEffect(() => {
//     const getSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       setSession(data.session);
//     };

//     getSession();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setSession(session);
//         // If user logs in, fetch their summaries
//         if (session) {
//           fetchSummaries(session.access_token);
//         } else {
//           setSummaries([]); // Clear summaries on logout
//         }
//       }
//     );

//     return () => {
//       listener?.subscription.unsubscribe();
//     };
//   }, [supabase.auth]);

//   // NEW function to fetch summaries from our backend
//   const fetchSummaries = async (token) => {
//     try {
//       const response = await axios.get('http://localhost:3000/summarizer', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSummaries(response.data);
//     } catch (error) {
//       console.error("Error fetching summaries:", error);
//     }
//   };


//   if (!session) {
//     // Show the login form if there is no active session
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-900">
//         <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
//           <Auth
//             supabaseClient={supabase}
//             appearance={{ theme: ThemeSupa }}
//             theme="dark"
//             providers={['google']}
//             redirectTo="http://localhost:3001"
//           />
//         </div>
//       </div>
//     );
//   }

//   // Show the dashboard if there is an active session
//   return (
//     <div className="min-h-screen bg-gray-900 p-8 text-white">
//       <div className="mx-auto max-w-4xl">
//         <div className="flex items-center justify-between">
//           <p>Logged in as: <strong>{session.user.email}</strong></p>
//           <button
//             onClick={() => supabase.auth.signOut()}
//             className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
//           >
//             Sign Out
//           </button>
//         </div>

//         <h1 className="my-8 text-center text-4xl font-bold">Your Summaries</h1>

//         {/* Display the list of summaries */}
//         <div className="space-y-4">
//           {summaries.length > 0 ? (
//             summaries.map((summary) => (
//               <div key={summary.id} className="rounded-lg bg-gray-800 p-4">
//                 <h3 className="font-bold">{summary.video_title || 'No Title'}</h3>
//                 <a href={summary.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
//                   {summary.video_url}
//                 </a>
//                 <p className="mt-2 text-gray-300">{summary.summary_text}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-400">You have no saved summaries yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }