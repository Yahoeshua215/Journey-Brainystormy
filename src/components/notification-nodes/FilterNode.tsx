'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface FilterNodeData extends NotificationNodeData {
  conditions?: string[];
  filterType?: 'all' | 'any';
}

export default function FilterNode(props: NodeProps<FilterNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.filterType ? `Match ${data.filterType} conditions` : undefined,
    ...(data.conditions || []),
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: <span className="text-yellow-600 text-lg">🔍</span>,
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 