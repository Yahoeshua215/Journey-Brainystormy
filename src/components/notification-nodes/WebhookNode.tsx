'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface WebhookNodeData extends NotificationNodeData {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: string[];
}

export default function WebhookNode(props: NodeProps<WebhookNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.url ? `URL: ${data.url}` : undefined,
    data.method ? `Method: ${data.method}` : undefined,
    ...(data.headers || []).map(header => `Header: ${header}`),
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: <span className="text-purple-600 text-lg">🔗</span>,
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 