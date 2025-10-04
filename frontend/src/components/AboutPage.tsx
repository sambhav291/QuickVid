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

// Icon Components
const SpeedIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DevicesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const FreeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const NoSignupIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const StudentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ProfessionalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ResearcherIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CreatorIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const LearnerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-blue-400"><SpeedIcon /></div>
                <span className="text-sm">Fast AI-powered summaries</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-blue-400"><SaveIcon /></div>
                <span className="text-sm">Save summaries for later</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-blue-400"><DevicesIcon /></div>
                <span className="text-sm">Works on any device</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-blue-400"><FreeIcon /></div>
                <span className="text-sm">Free to use</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-blue-400"><LockIcon /></div>
                <span className="text-sm">Secure & private</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-blue-400"><NoSignupIcon /></div>
                <span className="text-sm">No registration required</span>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="rounded-lg bg-gray-800/70 backdrop-blur-sm p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-3 text-white">Perfect For</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="text-center p-3 bg-gray-700/30 rounded">
                <div className="flex justify-center mb-2 text-blue-400"><StudentIcon /></div>
                <div className="font-medium">Students</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded">
                <div className="flex justify-center mb-2 text-blue-400"><ProfessionalIcon /></div>
                <div className="font-medium">Professionals</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded">
                <div className="flex justify-center mb-2 text-blue-400"><ResearcherIcon /></div>
                <div className="font-medium">Researchers</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded">
                <div className="flex justify-center mb-2 text-blue-400"><CreatorIcon /></div>
                <div className="font-medium">Creators</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded">
                <div className="flex justify-center mb-2 text-blue-400"><LearnerIcon /></div>
                <div className="font-medium">Learners</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded">
                <div className="flex justify-center mb-2 text-blue-400"><ClockIcon /></div>
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
                <span>Your video summaries and titles are <strong>encrypted</strong> before they leave your device. Only you can access them.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>We store only the video URL (for functionality); all summary content is stored securely and privately.</span>
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



