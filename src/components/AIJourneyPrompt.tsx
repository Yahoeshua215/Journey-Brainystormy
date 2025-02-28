'use client';

import { useState, useEffect, useRef } from 'react';

interface AIJourneyPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateJourney: (prompt: string) => void;
  initialPrompt?: string;
}

export default function AIJourneyPrompt({ isOpen, onClose, onGenerateJourney, initialPrompt }: AIJourneyPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Set default example prompt when modal opens
  useEffect(() => {
    if (isOpen) {
      // Focus the textarea without setting a default value
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      onGenerateJourney(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-red-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path fill="white" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              <path fill="white" d="M11 11h2v7.5h-2z" />
              <path fill="white" d="M13 13v-2h-4v2h2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">OneSignal Intelligence</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Describe the journey you want to create, including your goals, target audience, and preferred channels.
        </p>
        
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a re-engagement journey for a shoe store using push notifications, emails, and in-app messages to bring back customers who haven't made a purchase in 30 days."
          className="w-full border border-gray-300 rounded-md p-3 h-32 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className={`px-4 py-2 bg-red-600 text-white rounded-md flex items-center ${
              isLoading || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Generate Journey
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 