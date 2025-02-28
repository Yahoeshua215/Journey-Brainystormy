'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface EmailNodeData extends NotificationNodeData {
  subject?: string;
  template?: string;
}

export default function EmailNode(props: NodeProps<EmailNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.subject ? `Subject: ${data.subject}` : undefined,
    data.template ? `Template: ${data.template}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: (
      <div className="bg-blue-100 w-8 h-8 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
      </div>
    ),
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 