"use client";

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function AboutPage() {
  return (
    <>
      <div className="pt-24 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">About QuickVid</h1>
          <p className="text-lg text-gray-400">Save time with AI-powered YouTube video summaries</p>
        </div>
      
        <div className="space-y-6 text-gray-300">
        {/* Mission Section */}
        <section className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-white">Our Mission</h2>
          <p className="leading-relaxed">
            QuickVid helps you save time by instantly summarizing YouTube videos into clear, concise 
            key points. Whether you&apos;re a student, professional, or lifelong learner, get the information 
            you need without watching entire videos.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-white">How It Works</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-white">Paste Video Link</h3>
                <p className="text-sm text-gray-400">Copy and paste any YouTube video URL</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-white">AI Analysis</h3>
                <p className="text-sm text-gray-400">Our AI processes the video content in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-white">Get Summary</h3>
                <p className="text-sm text-gray-400">Receive organized summary with key takeaways</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <span>Fast AI-powered summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <span>Save summaries for later</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <span>Works on any device</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <span>Secure & private</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <span>No registration required</span>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-white">Perfect For</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="text-center p-3 bg-gray-700/30 rounded">
              <div className="text-2xl mb-1">🎓</div>
              <div className="font-medium">Students</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded">
              <div className="text-2xl mb-1">💼</div>
              <div className="font-medium">Professionals</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded">
              <div className="text-2xl mb-1">📚</div>
              <div className="font-medium">Researchers</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded">
              <div className="text-2xl mb-1">🎬</div>
              <div className="font-medium">Creators</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded">
              <div className="text-2xl mb-1">🌟</div>
              <div className="font-medium">Learners</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded">
              <div className="text-2xl mb-1">⏰</div>
              <div className="font-medium">Busy People</div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-white">Privacy & Security</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>We only store video URLs, titles, and summaries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Your saved summaries are private and accessible only to you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>No data sharing with third parties</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Delete your summaries anytime</span>
            </li>
          </ul>
        </section>
        </div>
      </div>

      {/* Footer - Full width background */}
      <footer className="w-full bg-gray-800/70 backdrop-blur-sm border-t border-gray-700 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2 text-white">Contact</h2>
            <p className="text-sm text-gray-400">Questions or feedback? Get in touch.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a 
              href="https://www.linkedin.com/in/sambhav-magotra-3a6187258" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
            <a 
              href="mailto:sambhavmagotra009@gmail.com"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <EmailIcon />
              <span>sambhavmagotra009@gmail.com</span>
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">
              Built with ❤️ by Sambhav
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} QuickVid. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
