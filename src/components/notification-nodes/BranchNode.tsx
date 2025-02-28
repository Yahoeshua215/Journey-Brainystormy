'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface BranchNodeData extends NotificationNodeData {
  condition?: string;
}

export default function BranchNode(props: NodeProps<BranchNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.condition ? `${data.condition}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: (
      <div className="bg-orange-100 w-8 h-8 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-600">
          <path fillRule="evenodd" d="M15 3.75A5.25 5.25 0 0 0 9.75 9v10.19l4.72-4.72a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 1 1 1.06-1.06l4.72 4.72V9a6.75 6.75 0 0 1 13.5 0v3a.75.75 0 0 1-1.5 0V9c0-2.9-2.35-5.25-5.25-5.25Z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 