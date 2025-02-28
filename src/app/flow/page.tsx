'use client';

import { useState } from 'react';
import FlowDiagram from '@/components/FlowDiagram';
import AdvancedFlowDiagram from '@/components/AdvancedFlowDiagram';

export default function FlowPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">React Flow Demo</h1>
      <p className="mb-8 text-gray-600 max-w-2xl text-center">
        This is a demonstration of React Flow, a library for building node-based UIs.
        You can drag nodes, connect them, and interact with the diagram.
      </p>

      <div className="w-full max-w-5xl mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Flow
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'advanced'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced Flow
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl border border-gray-200 rounded-lg shadow-md overflow-hidden">
        {activeTab === 'basic' ? (
          <>
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-medium">Basic Flow Diagram</h2>
              <p className="text-sm text-gray-500">A simple flow with default nodes and edges</p>
            </div>
            <FlowDiagram />
          </>
        ) : (
          <>
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-medium">Advanced Flow Diagram</h2>
              <p className="text-sm text-gray-500">
                Custom nodes, edge styling, and interactive features
              </p>
            </div>
            <AdvancedFlowDiagram />
          </>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500 max-w-2xl">
        {activeTab === 'basic' ? (
          <p>
            Tip: You can drag nodes, zoom with the mouse wheel, and pan by dragging the background.
          </p>
        ) : (
          <div>
            <p className="font-medium mb-2">Advanced Features:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Custom styled nodes with icons and descriptions</li>
              <li>Edge labels and arrow markers</li>
              <li>Node selection with details panel</li>
              <li>Add new nodes with the "Add Node" button</li>
              <li>Enhanced minimap with zoom and pan capabilities</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
} 