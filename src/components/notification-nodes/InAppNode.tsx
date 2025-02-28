'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface InAppNodeData extends NotificationNodeData {
  message?: string;
  placement?: string;
}

export default function InAppNode(props: NodeProps<InAppNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.message ? `Message: ${data.message}` : undefined,
    data.placement ? `Placement: ${data.placement}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: <span className="text-indigo-600 text-lg">📱</span>,
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 