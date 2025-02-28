'use client';

import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import JourneyBuilder from '@/components/JourneyBuilder';
import JourneyAnalytics from '@/components/JourneyAnalytics';
import JourneyABTest from '@/components/JourneyABTest';
import { Node, Edge } from 'reactflow';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function JourneyPage() {
  const searchParams = useSearchParams();
  const promptParam = searchParams.get('prompt');
  
  const [journeyName, setJourneyName] = useState('New Engagement Journey');
  const [journeyStatus, setJourneyStatus] = useState<'draft' | 'active' | 'paused' | 'completed'>('draft');
  const [activeTab, setActiveTab] = useState<'builder' | 'analytics'>('builder');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showABTestPanel, setShowABTestPanel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle journey name change
  const handleJourneyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJourneyName(e.target.value);
  };

  // Function to save journey
  const handleSaveJourney = () => {
    console.log('Saving journey:', { journeyName, nodes, edges });
    // Here you would typically save to a database
    setSuccessMessage('Journey saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Function to activate journey
  const handleActivateJourney = () => {
    setJourneyStatus('active');
    setSuccessMessage('Journey activated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Function to pause journey
  const handlePauseJourney = () => {
    setJourneyStatus('paused');
    setSuccessMessage('Journey paused successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Function to resume journey
  const handleResumeJourney = () => {
    setJourneyStatus('active');
    setSuccessMessage('Journey resumed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Function to handle journey changes
  const handleJourneyChange = (updatedNodes: Node[], updatedEdges: Edge[]) => {
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  // Function to handle A/B test creation
  const handleCreateTest = (testConfig: any) => {
    console.log('Creating A/B test:', testConfig);
    // Here you would typically save the test configuration to a database
    setShowABTestPanel(false);
    setSuccessMessage('A/B test created successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <ReactFlowProvider>
      <main className="flex h-screen flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Journey Builder</h1>
            <button
              className="px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
              onClick={() => setShowABTestPanel(true)}
            >
              Create A/B Test
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900" 
              placeholder="Journey Name" 
              value={journeyName}
              onChange={handleJourneyNameChange}
            />
            <button 
              className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              onClick={handleSaveJourney}
            >
              Save Journey
            </button>
            {journeyStatus === 'draft' && (
              <button 
                className="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                onClick={handleActivateJourney}
              >
                Activate
              </button>
            )}
            {journeyStatus === 'active' && (
              <button 
                className="px-4 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                onClick={handlePauseJourney}
              >
                Pause
              </button>
            )}
            {journeyStatus === 'paused' && (
              <button 
                className="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                onClick={handleResumeJourney}
              >
                Resume
              </button>
            )}
          </div>
        </header>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="bg-white border-b border-gray-200">
          <div className="flex px-6">
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'builder' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => setActiveTab('builder')}
            >
              Journey Builder
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 overflow-hidden">
          {activeTab === 'builder' && (
            <>
              <JourneyBuilder 
                onJourneyChange={handleJourneyChange}
                className="h-full"
                initialPrompt={promptParam || undefined}
              />
              {showABTestPanel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">Create A/B Test</h2>
                      <button 
                        className="text-gray-700 hover:text-gray-900"
                        onClick={() => setShowABTestPanel(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <JourneyABTest 
                        nodes={nodes}
                        edges={edges}
                        onCreateTest={handleCreateTest}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'analytics' && (
            <div className="p-6 h-full">
              <JourneyAnalytics 
                nodes={nodes}
                edges={edges}
                journeyStatus={journeyStatus}
              />
            </div>
          )}
        </div>
      </main>
    </ReactFlowProvider>
  );
} 