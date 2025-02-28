'use client';

import { Handle, Position, NodeProps } from 'reactflow';

export interface NotificationNodeData {
  label: string;
  icon: React.ReactNode;
  details?: string[];
  status?: 'incomplete' | 'complete';
}

export default function BaseNotificationNode({ 
  data, 
  isConnectable,
  selected
}: NodeProps<NotificationNodeData>) {
  return (
    <div className={`px-4 py-3 shadow-md rounded-lg bg-white border ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'} ${data.status === 'incomplete' ? 'border-yellow-400' : ''} min-w-[250px] transition-all`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-gray-400" 
        isConnectable={isConnectable} 
      />
      
      <div className="flex items-center mb-2">
        <div className="rounded-md w-8 h-8 flex justify-center items-center mr-3">
          {data.icon}
        </div>
        <div className="font-medium text-gray-800">{data.label}</div>
      </div>
      
      {data.details && data.details.length > 0 && (
        <div className="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-2 space-y-2">
          {data.details.map((detail, index) => {
            // Check if the detail has a label format like "Trigger: Value"
            const parts = detail.split(':');
            if (parts.length > 1) {
              return (
                <div key={index} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">{parts[0].trim()}:</span>
                  <span className="text-sm">{parts.slice(1).join(':').trim()}</span>
                </div>
              );
            }
            
            // For exit rules and other non-labeled details
            return (
              <div key={index} className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>{detail}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {data.status === 'incomplete' && (
        <div className="mt-2 text-xs text-yellow-600 italic">
          There is still work to do
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-gray-400" 
        isConnectable={isConnectable} 
      />
    </div>
  );
} 