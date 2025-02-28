'use client';

import { useState, useEffect } from 'react';
import { Node } from 'reactflow';

interface NodeConfigPanelProps {
  node: Node;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
  onDelete: (nodeId: string) => void;
}

export default function NodeConfigPanel({ 
  node, 
  onClose, 
  onUpdate, 
  onDelete 
}: NodeConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'content' | 'conditions' | 'advanced'>('settings');
  const [formData, setFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Initialize form data from node data and trigger animation
  useEffect(() => {
    setFormData(node.data || {});
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 50);
  }, [node.data]);
  
  const updateFormData = (newData: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, ...newData };
      // Check if data has changed from original node data
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(node.data));
      return updated;
    });
  };
  
  const saveChanges = () => {
    console.log('Saving changes:', formData);
    onUpdate(node.id, formData);
    setHasChanges(false);
  };

  const handleClose = () => {
    // Animate out before closing
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div 
      className={`fixed top-0 right-0 bottom-0 flex justify-end items-stretch z-50 transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex flex-col h-full bg-white rounded-l-lg shadow-xl border border-gray-200 border-r-0 overflow-visible max-w-[90vw] w-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold truncate">{node.data?.label || 'Node Configuration'}</h2>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation - No wrapping, with more space */}
        <div className="flex border-b border-gray-200 px-4 pt-2 gap-2 overflow-visible">
          <button
            className={`px-5 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          {node.type !== 'entrance' && node.type !== 'exit' && (
            <button
              className={`px-5 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
          )}
          {node.type !== 'entrance' && node.type !== 'exit' && node.type !== 'wait' && (
            <button
              className={`px-5 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'conditions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('conditions')}
            >
              Conditions
            </button>
          )}
          <button
            className={`px-5 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'advanced' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </div>
        
        {/* Content Area - No scrolling, full content visible */}
        <div className="flex-1 p-4 overflow-visible">
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={formData.label || ''}
                    onChange={(e) => updateFormData({ label: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              
              {node.type === 'wait' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="1"
                      value={formData.durationValue || '1'}
                      onChange={(e) => updateFormData({ 
                        durationValue: e.target.value,
                        duration: `${e.target.value} ${formData.durationUnit || 'Days'}`
                      })}
                      className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select 
                      value={formData.durationUnit || 'Days'}
                      onChange={(e) => updateFormData({ 
                        durationUnit: e.target.value,
                        duration: `${formData.durationValue || '1'} ${e.target.value}`
                      })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="Minutes">Minutes</option>
                      <option value="Hours">Hours</option>
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                    </select>
                  </div>
                </div>
              )}
              </div>
              
              {node.type === 'split' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Split Type</label>
                    <select 
                      value={formData.splitType || 'percentage'}
                      onChange={(e) => updateFormData({ splitType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="percentage">Percentage Split</option>
                      <option value="random">Random Assignment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Randomize on re-entry</label>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="randomizeReentry"
                        checked={formData.randomizeReentry !== false}
                        onChange={(e) => updateFormData({ randomizeReentry: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="randomizeReentry" className="ml-2 text-sm text-gray-700 whitespace-normal">
                        Reassign users to different paths when they re-enter the journey
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {node.type === 'entrance' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                    <select 
                      value={formData.trigger || 'audience-segment'}
                      onChange={(e) => updateFormData({ trigger: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="audience-segment">Audience Segment</option>
                      <option value="user-action">User Action</option>
                      <option value="api-trigger">API Trigger</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                    <select 
                      value={formData.startCondition || 'immediately'}
                      onChange={(e) => updateFormData({ startCondition: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="immediately">Immediately</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="specific-time">Specific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Condition</label>
                    <input 
                      type="text" 
                      value={formData.filterCondition || ''}
                      onChange={(e) => updateFormData({ filterCondition: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Last purchase > 45 days ago?"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Define a condition that users must meet to enter this journey
                    </p>
                  </div>
                </div>
              )}
              
              {node.type === 'exit' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exit Rules</label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="exitRule1"
                          checked={(formData.exitRules || []).includes('User has received all messages or')}
                          onChange={(e) => {
                            const rules = [...(formData.exitRules || [])];
                            if (e.target.checked) {
                              rules.push('User has received all messages or');
                            } else {
                              const index = rules.indexOf('User has received all messages or');
                              if (index > -1) rules.splice(index, 1);
                            }
                            updateFormData({ exitRules: rules });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="exitRule1" className="ml-2 text-sm text-gray-700 whitespace-normal">User has received all messages</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="exitRule2"
                          checked={(formData.exitRules || []).includes('User becomes active or')}
                          onChange={(e) => {
                            const rules = [...(formData.exitRules || [])];
                            if (e.target.checked) {
                              rules.push('User becomes active or');
                            } else {
                              const index = rules.indexOf('User becomes active or');
                              if (index > -1) rules.splice(index, 1);
                            }
                            updateFormData({ exitRules: rules });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="exitRule2" className="ml-2 text-sm text-gray-700 whitespace-normal">User becomes active</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="exitRule3"
                          checked={(formData.exitRules || []).includes('User no longer matches audience conditions')}
                          onChange={(e) => {
                            const rules = [...(formData.exitRules || [])];
                            if (e.target.checked) {
                              rules.push('User no longer matches audience conditions');
                            } else {
                              const index = rules.indexOf('User no longer matches audience conditions');
                              if (index > -1) rules.splice(index, 1);
                            }
                            updateFormData({ exitRules: rules });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="exitRule3" className="ml-2 text-sm text-gray-700 whitespace-normal">User no longer matches audience conditions</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Re-Entry Rules</label>
                    <select 
                      value={formData.reEntryRules?.[0] || 'once'}
                      onChange={(e) => updateFormData({ reEntryRules: [e.target.value] })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="Users can only enter the Journey once">Only once</option>
                      <option value="Users can re-enter after exiting">Allow re-entry after exit</option>
                      <option value="Users can re-enter after a waiting period">After waiting period</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {node.type === 'push' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={formData.title || ''}
                      onChange={(e) => {
                        updateFormData({ title: e.target.value });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Notification title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      value={formData.message || ''}
                      onChange={(e) => {
                        updateFormData({ 
                          message: e.target.value,
                          status: e.target.value ? 'complete' : 'incomplete'
                        });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your message here"
                      rows={4}
                    />
                  </div>
                </div>
              )}
              
              {node.type === 'email' && (
                <>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={formData.subject || ''}
                        onChange={(e) => updateFormData({ 
                          subject: e.target.value,
                          status: e.target.value ? 'complete' : 'incomplete'
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Email subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
                      <textarea 
                        value={formData.content || ''}
                        onChange={(e) => updateFormData({ content: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email content here"
                        rows={8}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                      <select 
                        value={formData.template || ''}
                        onChange={(e) => updateFormData({ template: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">Select template</option>
                        <option value="welcome">Welcome</option>
                        <option value="active-user-reward">Active User Reward</option>
                        <option value="re-engagement">Re-engagement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                      <input 
                        type="text" 
                        value={formData.senderName || ''}
                        onChange={(e) => updateFormData({ senderName: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {node.type === 'sms' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      value={formData.message || ''}
                      onChange={(e) => updateFormData({ 
                        message: e.target.value,
                        status: e.target.value ? 'complete' : 'incomplete'
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your SMS message here"
                      rows={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
                    <input 
                      type="text" 
                      value={formData.phoneNumbers || ''}
                      onChange={(e) => updateFormData({ phoneNumbers: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone numbers separated by commas"
                    />
                  </div>
                </div>
              )}
              
              {node.type === 'inApp' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={formData.title || ''}
                      onChange={(e) => updateFormData({ title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Message title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      value={formData.message || ''}
                      onChange={(e) => updateFormData({ 
                        message: e.target.value,
                        status: e.target.value ? 'complete' : 'incomplete'
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your in-app message here"
                      rows={5}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                    <select 
                      value={formData.placement || 'center'}
                      onChange={(e) => updateFormData({ placement: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="center">Center Modal</option>
                      <option value="top">Top Banner</option>
                      <option value="bottom">Bottom Banner</option>
                      <option value="full">Full Screen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action</label>
                    <input 
                      type="text" 
                      value={formData.cta || ''}
                      onChange={(e) => updateFormData({ cta: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Button text (e.g., 'Learn More')"
                    />
                  </div>
                </div>
              )}
              
              {node.type === 'webhook' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                    <input 
                      type="text" 
                      value={formData.webhookUrl || ''}
                      onChange={(e) => updateFormData({ 
                        webhookUrl: e.target.value,
                        status: e.target.value ? 'complete' : 'incomplete'
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <select 
                      value={formData.method || 'POST'}
                      onChange={(e) => updateFormData({ method: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payload</label>
                    <textarea 
                      value={formData.payload || ''}
                      onChange={(e) => updateFormData({ payload: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder='{"user_id": "{{user_id}}", "event": "{{event}}"}'
                      rows={5}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Conditions Tab */}
          {activeTab === 'conditions' && (
            <div className="space-y-6">
              {node.type === 'branch' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select 
                      value={formData.condition || ''}
                      onChange={(e) => updateFormData({ condition: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select condition</option>
                      <option value="User has opened app">User has opened app</option>
                      <option value="User has completed purchase">User has completed purchase</option>
                      <option value="User has clicked previous message">User has clicked previous message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yes Path Label</label>
                    <input 
                      type="text" 
                      value={formData.yesLabel || 'Yes'}
                      onChange={(e) => updateFormData({ yesLabel: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Path Label</label>
                    <input 
                      type="text" 
                      value={formData.noLabel || 'No'}
                      onChange={(e) => updateFormData({ noLabel: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
              
              {node.type === 'filter' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
                    <select 
                      value={formData.filterType || 'all'}
                      onChange={(e) => updateFormData({ filterType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="all">Match All Conditions</option>
                      <option value="any">Match Any Condition</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
                    <div className="space-y-2 mt-1">
                      {(formData.conditions || []).map((condition: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={condition}
                            onChange={(e) => {
                              const conditions = [...(formData.conditions || [])];
                              conditions[index] = e.target.value;
                              updateFormData({ conditions });
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button 
                            onClick={() => {
                              const conditions = [...(formData.conditions || [])];
                              conditions.splice(index, 1);
                              updateFormData({ conditions });
                            }}
                            className="text-red-500 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const conditions = [...(formData.conditions || []), ''];
                          updateFormData({ conditions });
                        }}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        + Add Condition
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Node ID</label>
                  <input 
                    type="text" 
                    value={node.id}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Node Type</label>
                  <input 
                    type="text" 
                    value={node.type}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                
                {/* Mark as complete checkbox */}
                <div className="flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    id="nodeComplete"
                    checked={formData.status !== 'incomplete'}
                    onChange={(e) => updateFormData({ 
                      status: e.target.checked ? 'complete' : 'incomplete' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="nodeComplete" className="ml-2 text-sm text-gray-700 whitespace-normal">Mark as configured</label>
                </div>
                
                {/* Delivery settings for message nodes */}
                {(node.type === 'push' || node.type === 'email' || node.type === 'sms') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Settings</label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="throttle"
                          checked={formData.throttle || false}
                          onChange={(e) => updateFormData({ throttle: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="throttle" className="ml-2 text-sm text-gray-700 whitespace-normal">Throttle delivery</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="localTimeDelivery"
                          checked={formData.localTimeDelivery || false}
                          onChange={(e) => updateFormData({ localTimeDelivery: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="localTimeDelivery" className="ml-2 text-sm text-gray-700 whitespace-normal">Deliver in user's local time</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center">
          <button
            onClick={saveChanges}
            disabled={!hasChanges}
            className={`px-3 py-1.5 text-xs font-medium rounded border shadow-sm ${
              hasChanges 
                ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
          
          <div className="flex-1"></div>
          
          <button
            onClick={() => onDelete(node.id)}
            className="px-3 py-1.5 text-xs font-medium rounded border border-red-200 text-red-600 hover:bg-red-50 shadow-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
} 