'use client';

import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  description?: string;
  icon?: string;
}

export default function CustomNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      
      <div className="flex items-center">
        {data.icon && (
          <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100 mr-2">
            <span className="text-sm">{data.icon}</span>
          </div>
        )}
        <div>
          <div className="font-bold">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-500">{data.description}</div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
} 