'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartBuilding = () => {
    router.push('/journey?prompt=true');
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* OneSignal Logo */}
          <div className="flex justify-center mb-3">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-500">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path fill="white" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                <path fill="white" d="M11 11h2v7.5h-2z" />
                <path fill="white" d="M13 13v-2h-4v2h2z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-lg md:text-xl text-gray-600 mb-2">
            OneSignal Intelligence
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
            Intelligent Journey Builder
          </h1>
          
          <h3 className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Create personalized notification workflows across multiple channels to engage your users at the right time with the right message.
          </h3>

          {/* Start Building Button */}
          <button
            onClick={handleStartBuilding}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-medium text-lg rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            Start Building Your Journey
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1">AI-Powered Suggestions</h3>
            <p className="text-gray-600 text-xs">Get intelligent recommendations for your customer journey based on industry best practices.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1">Multi-Channel Workflows</h3>
            <p className="text-gray-600 text-xs">Create seamless journeys across email, SMS, push notifications, and in-app messages.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1">Real-Time Analytics</h3>
            <p className="text-gray-600 text-xs">Track performance metrics and optimize your journeys with detailed analytics.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
