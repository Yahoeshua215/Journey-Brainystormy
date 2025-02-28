'use client';

import BaseNotificationNode, { NotificationNodeData } from './BaseNotificationNode';
import { NodeProps } from 'reactflow';

interface OutcomeNodeData extends NotificationNodeData {
  conversionEvent?: string;
  conversionWindow?: string;
  attributionWindow?: string;
}

export default function OutcomeNode(props: NodeProps<OutcomeNodeData>) {
  const { data } = props;
  
  // Prepare details for the base node
  const details = [
    data.conversionEvent ? `Event: ${data.conversionEvent}` : undefined,
    data.conversionWindow ? `Conversion window: ${data.conversionWindow}` : undefined,
    data.attributionWindow ? `Attribution window: ${data.attributionWindow}` : undefined,
  ].filter(Boolean) as string[];
  
  // Create enhanced data for the base node
  const enhancedData = {
    ...data,
    icon: <span className="text-green-600 text-lg">🎯</span>,
    details,
  };
  
  return <BaseNotificationNode {...props} data={enhancedData} />;
} 