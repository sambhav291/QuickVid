"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppContext } from '@/context/AppContext';

export default function AuthModal() {
  const supabase = createClientComponentClient();
  const { setShowAuthModal } = useAppContext();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" 
      onClick={() => setShowAuthModal(false)}
    >
      <div 
        className="glass-card rounded-2xl p-8 max-w-md w-full border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 relative overflow-hidden fade-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">Welcome Back</h2>
                <p className="text-xs text-gray-400">Sign in to save your summaries</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="text-gray-400 hover:text-white transition-all p-2 hover:bg-blue-500/20 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4f9cf9',
                      brandAccent: '#00d9ff',
                      inputBackground: 'rgba(15, 23, 42, 0.6)',
                      inputBorder: 'rgba(79, 156, 249, 0.2)',
                      inputBorderFocus: 'rgba(79, 156, 249, 0.5)',
                      inputBorderHover: 'rgba(79, 156, 249, 0.3)',
                    }
                  }
                },
                className: {
                  container: 'auth-container',
                  button: 'auth-button',
                  input: 'auth-input',
                }
              }}
              theme="dark"
              providers={[]}
            />
          </div>
          
        </div>
      </div>
      
      <style jsx global>{`
        .auth-container {
          color: #e8f0ff;
        }
        .auth-button {
          background: linear-gradient(135deg, #4f9cf9 0%, #00d9ff 100%) !important;
          border: none !important;
          border-radius: 0.75rem !important;
          font-weight: 600 !important;
          padding: 0.75rem !important;
          transition: all 0.3s ease !important;
        }
        .auth-button:hover {
          box-shadow: 0 0 30px rgba(79, 156, 249, 0.6) !important;
          transform: translateY(-2px) !important;
        }
        .auth-input {
          background: rgba(15, 23, 42, 0.6) !important;
          border: 1px solid rgba(79, 156, 249, 0.2) !important;
          border-radius: 0.75rem !important;
          color: #e8f0ff !important;
          padding: 0.75rem !important;
        }
        .auth-input:focus {
          border-color: rgba(79, 156, 249, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(79, 156, 249, 0.1) !important;
        }
      `}</style>
    </div>
  );
}







