'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface EntranceNodeData extends NotificationNodeData {
  trigger?: string;
  startCondition?: string;
  filterCondition?: string;
}

export default function EntranceNode(props: NodeProps<EntranceNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.trigger ? `Trigger: ${data.trigger}` : undefined,
    data.startCondition ? `Start: ${data.startCondition}` : undefined,
    data.filterCondition ? `Filter: ${data.filterCondition}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: (
      <div className="bg-green-100 w-8 h-8 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600">
          <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 