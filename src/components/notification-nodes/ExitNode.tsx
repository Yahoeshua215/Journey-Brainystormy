'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface ExitNodeData extends NotificationNodeData {
  exitRules?: string[];
  reEntryRules?: string[];
  stopCondition?: string;
}

export default function ExitNode(props: NodeProps<ExitNodeData>) {
  const { data } = props;
  
  // Format exit rules with proper headers
  const formattedExitRules = data.exitRules?.length 
    ? ['Exit Rules', ...data.exitRules.map(rule => rule)]
    : [];
    
  // Format re-entry rules with proper headers
  const formattedReEntryRules = data.reEntryRules?.length 
    ? ['Re-Entry Rules', ...data.reEntryRules.map(rule => rule)]
    : [];
  
  // Prepare details for the base node
  const details = [
    ...formattedExitRules,
    ...formattedReEntryRules,
    data.stopCondition ? `Stop: ${data.stopCondition}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: (
      <div className="bg-green-100 w-8 h-8 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600">
          <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 