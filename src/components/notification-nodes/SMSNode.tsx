'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface SMSNodeData extends NotificationNodeData {
  message?: string;
  phoneNumbers?: string;
}

export default function SMSNode(props: NodeProps<SMSNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.message ? `Message: ${data.message}` : undefined,
    data.phoneNumbers ? `To: ${data.phoneNumbers}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: <span className="text-green-600 text-lg">💬</span>,
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 