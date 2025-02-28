'use client';

import { useState } from 'react';
import { Node, Edge } from 'reactflow';

interface JourneyABTestProps {
  nodes: Node[];
  edges: Edge[];
  onCreateTest: (testConfig: ABTestConfig) => void;
  className?: string;
}

interface ABTestConfig {
  name: string;
  description: string;
  nodeId: string;
  variants: {
    name: string;
    distribution: number;
    content: any;
  }[];
  duration: number;
  durationUnit: 'hours' | 'days' | 'weeks';
  winningCriteria: 'clicks' | 'conversions' | 'engagement';
}

export default function JourneyABTest({ 
  nodes, 
  edges, 
  onCreateTest,
  className = '' 
}: JourneyABTestProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [testName, setTestName] = useState<string>('');
  const [testDescription, setTestDescription] = useState<string>('');
  const [variants, setVariants] = useState<{name: string, distribution: number, content: any}[]>([
    { name: 'Variant A (Control)', distribution: 50, content: {} },
    { name: 'Variant B', distribution: 50, content: {} }
  ]);
  const [duration, setDuration] = useState<number>(7);
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days' | 'weeks'>('days');
  const [winningCriteria, setWinningCriteria] = useState<'clicks' | 'conversions' | 'engagement'>('clicks');
  
  // Get testable nodes (push, email, sms, inApp)
  const testableNodes = nodes.filter(node => 
    ['push', 'email', 'sms', 'inApp'].includes(node.type || '')
  );
  
  // Handle variant distribution change
  const handleDistributionChange = (index: number, value: number) => {
    const newVariants = [...variants];
    newVariants[index].distribution = value;
    
    // Adjust other variant to maintain 100% total
    if (variants.length === 2) {
      const otherIndex = index === 0 ? 1 : 0;
      newVariants[otherIndex].distribution = 100 - value;
    }
    
    setVariants(newVariants);
  };
  
  // Add a new variant
  const addVariant = () => {
    if (variants.length >= 4) return; // Maximum 4 variants
    
    const newDistribution = Math.floor(100 / (variants.length + 1));
    const remainingDistribution = 100 - newDistribution;
    
    // Adjust existing variants
    const adjustedVariants = variants.map(variant => ({
      ...variant,
      distribution: Math.floor(variant.distribution * remainingDistribution / 100)
    }));
    
    // Add new variant
    setVariants([
      ...adjustedVariants,
      { 
        name: `Variant ${String.fromCharCode(65 + variants.length)}`, 
        distribution: newDistribution,
        content: {}
      }
    ]);
  };
  
  // Remove a variant
  const removeVariant = (index: number) => {
    if (variants.length <= 2) return; // Minimum 2 variants
    
    const removedDistribution = variants[index].distribution;
    const newVariants = variants.filter((_, i) => i !== index);
    
    // Redistribute the removed variant's percentage
    const redistributionFactor = 100 / (100 - removedDistribution);
    const adjustedVariants = newVariants.map(variant => ({
      ...variant,
      distribution: Math.floor(variant.distribution * redistributionFactor)
    }));
    
    // Ensure total is 100%
    let total = adjustedVariants.reduce((sum, v) => sum + v.distribution, 0);
    if (total !== 100 && adjustedVariants.length > 0) {
      adjustedVariants[0].distribution += (100 - total);
    }
    
    setVariants(adjustedVariants);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNodeId || !testName) {
      alert('Please select a node and provide a test name');
      return;
    }
    
    const testConfig: ABTestConfig = {
      name: testName,
      description: testDescription,
      nodeId: selectedNodeId,
      variants,
      duration,
      durationUnit,
      winningCriteria
    };
    
    onCreateTest(testConfig);
    
    // Reset form
    setTestName('');
    setTestDescription('');
    setSelectedNodeId('');
  };
  
  // Get selected node data
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">Create A/B Test</h2>
        <p className="text-sm text-gray-700 mt-1">
          Test different message variants to optimize engagement and conversions
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          {/* Test Name */}
          <div>
            <label htmlFor="testName" className="block text-sm font-medium text-gray-900">
              Test Name
            </label>
            <input
              type="text"
              id="testName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Welcome Email Optimization"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              required
            />
          </div>
          
          {/* Test Description */}
          <div>
            <label htmlFor="testDescription" className="block text-sm font-medium text-gray-900">
              Description (optional)
            </label>
            <textarea
              id="testDescription"
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Brief description of what you're testing"
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
            />
          </div>
          
          {/* Message Node Selection */}
          <div>
            <label htmlFor="nodeSelection" className="block text-sm font-medium text-gray-900">
              Select Message to Test
            </label>
            <select
              id="nodeSelection"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              required
            >
              <option value="">Select a message node</option>
              {testableNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data?.label || node.id} ({node.type})
                </option>
              ))}
            </select>
            {testableNodes.length === 0 && (
              <p className="mt-1 text-sm text-red-600">
                No testable message nodes found. Add push, email, SMS, or in-app message nodes to your journey.
              </p>
            )}
          </div>
          
          {/* Test Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-900">
                Test Duration
              </label>
              <input
                type="number"
                id="duration"
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
                required
              />
            </div>
            <div>
              <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-900">
                Duration Unit
              </label>
              <select
                id="durationUnit"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value as 'hours' | 'days' | 'weeks')}
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>
          </div>
          
          {/* Winning Criteria */}
          <div>
            <label htmlFor="winningCriteria" className="block text-sm font-medium text-gray-900">
              Winning Criteria
            </label>
            <select
              id="winningCriteria"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={winningCriteria}
              onChange={(e) => setWinningCriteria(e.target.value as 'clicks' | 'conversions' | 'engagement')}
            >
              <option value="clicks">Click Rate</option>
              <option value="conversions">Conversion Rate</option>
              <option value="engagement">Engagement Rate</option>
            </select>
            <p className="mt-1 text-sm text-gray-700">
              The metric that will determine the winning variant
            </p>
          </div>
          
          {/* Variants */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-900">
                Variants
              </label>
              {variants.length < 4 && (
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={addVariant}
                >
                  + Add Variant
                </button>
              )}
            </div>
            
            <div className="mt-2 space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={variant.name}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[index].name = e.target.value;
                        setVariants(newVariants);
                      }}
                      placeholder={`Variant ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                  <div className="w-24">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={variant.distribution}
                        onChange={(e) => handleDistributionChange(index, parseInt(e.target.value) || 0)}
                      />
                      <span className="ml-1 text-gray-700">%</span>
                    </div>
                  </div>
                  {variants.length > 2 && (
                    <button
                      type="button"
                      className="text-gray-700 hover:text-gray-900"
                      onClick={() => removeVariant(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-700">
              Total distribution must equal 100%
            </p>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Test
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 