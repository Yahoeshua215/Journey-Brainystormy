'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface PushNotificationNodeData extends NotificationNodeData {
  message?: string;
  audience?: string;
}

export default function PushNotificationNode(props: NodeProps<PushNotificationNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.message ? `Message: ${data.message}` : undefined,
    data.audience ? `Audience: ${data.audience}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: (
      <div className="bg-indigo-100 w-8 h-8 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
          <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 