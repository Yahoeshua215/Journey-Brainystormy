'use client';

import { useCallback } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

interface EdgeWithPlusButtonProps extends EdgeProps {
  data?: {
    onPlusClick?: (x: number, y: number, sourceNodeId: string) => void;
  };
}

export default function EdgeWithPlusButton({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  labelStyle,
  data,
  source
}: EdgeWithPlusButtonProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate the middle point of the edge for the plus button
  const middleX = (sourceX + targetX) / 2;
  const middleY = (sourceY + targetY) / 2;

  const handlePlusClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (data?.onPlusClick) {
        data.onPlusClick(middleX, middleY, source);
      }
    },
    [data, middleX, middleY, source]
  );

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 1.5 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${middleX}px,${middleY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-600 transition-colors"
            onClick={handlePlusClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
} 