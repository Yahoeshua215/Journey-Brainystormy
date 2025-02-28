'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface SplitBranchNodeData extends NotificationNodeData {
  splits?: { path: string; percentage: number }[];
  randomizeReentry?: boolean;
}

export default function SplitBranchNode(props: NodeProps<SplitBranchNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    ...(data.splits?.map(split => `${split.path}: ${split.percentage}%`) || []),
    data.randomizeReentry === false ? 'Randomize on re-entry: Off' : 'Randomize on re-entry: On',
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: <span className="text-blue-600 text-lg">⚖️</span>,
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 