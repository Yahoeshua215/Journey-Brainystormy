'use client';

import { useState } from 'react';
import { Node, Edge } from 'reactflow';

interface JourneyStats {
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
  conversionRate: number;
  nodePerformance: {
    nodeId: string;
    nodeName: string;
    nodeType: string;
    metrics: {
      entered: number;
      completed: number;
      rate: number;
    }
  }[];
}

interface JourneyAnalyticsProps {
  nodes: Node[];
  edges: Edge[];
  journeyStatus: 'draft' | 'active' | 'paused' | 'completed';
  className?: string;
}

export default function JourneyAnalytics({ 
  nodes, 
  edges, 
  journeyStatus,
  className = '' 
}: JourneyAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Generate mock statistics based on the journey status and nodes
  const generateMockStats = (): JourneyStats => {
    const totalUsers = journeyStatus === 'draft' ? 0 : Math.floor(Math.random() * 10000) + 1000;
    const activeUsers = journeyStatus === 'draft' ? 0 : Math.floor(totalUsers * (Math.random() * 0.8 + 0.1));
    const completionRate = journeyStatus === 'draft' ? 0 : Math.random() * 0.7 + 0.1;
    const conversionRate = journeyStatus === 'draft' ? 0 : Math.random() * 0.5 + 0.05;
    
    const nodePerformance = nodes.map(node => {
      const entered = journeyStatus === 'draft' 
        ? 0 
        : Math.floor(totalUsers * (Math.random() * 0.9 + 0.1));
      
      const completed = Math.floor(entered * (Math.random() * 0.9 + 0.1));
      
      return {
        nodeId: node.id,
        nodeName: node.data.label,
        nodeType: node.type || '',
        metrics: {
          entered,
          completed,
          rate: completed / entered
        }
      };
    });
    
    return {
      totalUsers,
      activeUsers,
      completionRate,
      conversionRate,
      nodePerformance
    };
  };
  
  const stats = generateMockStats();
  
  // Get message nodes (push, email, sms, inApp)
  const messageNodes = nodes.filter(node => 
    ['push', 'email', 'sms', 'inApp'].includes(node.type || '')
  );
  
  // Calculate overall engagement metrics
  const calculateEngagementMetrics = () => {
    if (journeyStatus === 'draft') {
      return { sent: 0, delivered: 0, opened: 0, clicked: 0 };
    }
    
    const totalSent = messageNodes.reduce((sum, node) => {
      const nodeStats = stats.nodePerformance.find(np => np.nodeId === node.id);
      return sum + (nodeStats?.metrics.entered || 0);
    }, 0);
    
    const deliveryRate = Math.random() * 0.2 + 0.8; // 80-100%
    const openRate = Math.random() * 0.4 + 0.2; // 20-60%
    const clickRate = Math.random() * 0.3 + 0.1; // 10-40%
    
    return {
      sent: totalSent,
      delivered: Math.floor(totalSent * deliveryRate),
      opened: Math.floor(totalSent * openRate),
      clicked: Math.floor(totalSent * clickRate)
    };
  };
  
  const engagementMetrics = calculateEngagementMetrics();
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Journey Analytics</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
            <button
              className={`px-3 py-1 text-xs rounded ${
                timeRange === '7d' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${
                timeRange === '30d' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${
                timeRange === '90d' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </button>
          </div>
        </div>
      </div>
      
      {journeyStatus === 'draft' ? (
        <div className="p-8 text-center">
          <div className="text-gray-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-800">Analytics will be available once the journey is active</p>
          </div>
          <p className="text-sm text-gray-700 max-w-md mx-auto">
            Activate your journey to start collecting data on user engagement, conversion rates, and message performance.
          </p>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-700">In journey</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-green-700 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-700">Currently active</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-xs text-purple-700 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.completionRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-700">Users completing journey</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-xs text-amber-700 font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.conversionRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-700">Reached primary outcome</p>
            </div>
          </div>
          
          {/* Message Engagement */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Message Engagement</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-700">Sent</p>
                <p className="text-xl font-semibold text-gray-900">{engagementMetrics.sent.toLocaleString()}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-700">Delivered</p>
                <p className="text-xl font-semibold text-gray-900">{engagementMetrics.delivered.toLocaleString()}</p>
                <p className="text-xs text-green-700">
                  {((engagementMetrics.delivered / engagementMetrics.sent) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-700">Opened</p>
                <p className="text-xl font-semibold text-gray-900">{engagementMetrics.opened.toLocaleString()}</p>
                <p className="text-xs text-green-700">
                  {((engagementMetrics.opened / engagementMetrics.sent) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-700">Clicked</p>
                <p className="text-xl font-semibold text-gray-900">{engagementMetrics.clicked.toLocaleString()}</p>
                <p className="text-xs text-green-700">
                  {((engagementMetrics.clicked / engagementMetrics.sent) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          {/* Node Performance */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Node Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Node</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Entered</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Completed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.nodePerformance.map((node) => (
                    <tr key={node.nodeId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{node.nodeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{node.nodeType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{node.metrics.entered.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{node.metrics.completed.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(node.metrics.rate * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 