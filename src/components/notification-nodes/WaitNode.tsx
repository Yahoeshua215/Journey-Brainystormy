'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface WaitNodeData extends NotificationNodeData {
  duration?: string;
}

export default function WaitNode(props: NodeProps<WaitNodeData>) {
  const { data } = props;
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: (
      <div className="bg-amber-100 w-8 h-8 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-600">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    details: data.duration ? [`Duration: ${data.duration}`] : [],
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 