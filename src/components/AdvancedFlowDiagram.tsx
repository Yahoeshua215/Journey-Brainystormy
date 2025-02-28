'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

// Define custom node types
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes with custom type
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'User Registration',
      description: 'New user signs up',
      status: 'completed',
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: { 
      label: 'Welcome Email',
      description: 'Send welcome email with verification link',
      status: 'active',
    },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    type: 'custom',
    data: { 
      label: 'Email Verification',
      description: 'User verifies email address',
      status: 'pending',
    },
    position: { x: 250, y: 200 },
  },
  {
    id: '4',
    type: 'custom',
    data: { 
      label: 'Profile Completion',
      description: 'User completes profile information',
      status: 'pending',
    },
    position: { x: 100, y: 300 },
  },
  {
    id: '5',
    type: 'custom',
    data: { 
      label: 'Skip Profile',
      description: 'User skips profile completion',
      status: 'pending',
    },
    position: { x: 400, y: 300 },
  },
  {
    id: '6',
    type: 'custom',
    data: { 
      label: 'Onboarding Tour',
      description: 'Guide user through app features',
      status: 'pending',
    },
    position: { x: 250, y: 400 },
  },
  {
    id: '7',
    type: 'custom',
    data: { 
      label: 'First Task',
      description: 'User completes first task in app',
      status: 'pending',
    },
    position: { x: 250, y: 500 },
  },
];

// Initial edges with markers and labels
const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4',
    label: 'Yes',
    labelStyle: { fill: '#888', fontWeight: 500 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e3-5', 
    source: '3', 
    target: '5',
    label: 'No',
    labelStyle: { fill: '#888', fontWeight: 500 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e4-6', 
    source: '4', 
    target: '6',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e5-6', 
    source: '5', 
    target: '6',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e6-7', 
    source: '6', 
    target: '7',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

interface AdvancedFlowDiagramProps {
  className?: string;
}

export default function AdvancedFlowDiagram({ className = '' }: AdvancedFlowDiagramProps) {
  return (
    <ReactFlowProvider>
      <AdvancedFlowDiagramContent className={className} />
    </ReactFlowProvider>
  );
}

function AdvancedFlowDiagramContent({ className = '' }: AdvancedFlowDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({
      ...connection,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Add a new node
  const addNode = useCallback(() => {
    const newNodeId = `${nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      data: { 
        label: 'New Step',
        description: 'Description of this step',
        status: 'pending',
      },
      position: { 
        x: 250, 
        y: nodes.reduce((maxY, node) => Math.max(maxY, node.position.y), 0) + 100 
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    // Connect to the last node if it exists
    if (nodes.length > 0) {
      const lastNodeId = nodes[nodes.length - 1].id;
      const newEdge: Edge = {
        id: `e${lastNodeId}-${newNodeId}`,
        source: lastNodeId,
        target: newNodeId,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
      
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [nodes, setNodes, setEdges]);

  return (
    <div className={`w-full h-[600px] ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable 
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        
        <Panel position="top-right" className="bg-white p-3 rounded-md shadow-md">
          <button 
            onClick={addNode}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Step
          </button>
        </Panel>
        
        {selectedNode && (
          <Panel position="bottom-center" className="bg-white p-4 rounded-t-md shadow-md w-full">
            <h3 className="font-medium mb-2">{selectedNode.data.label}</h3>
            <p className="text-sm text-gray-600 mb-3">{selectedNode.data.description}</p>
            <div className="flex gap-2">
              <select 
                value={selectedNode.data.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setNodes(nodes.map(node => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, status: newStatus } } 
                      : node
                  ));
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <button 
                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors"
                onClick={() => {
                  setNodes(nodes.filter(node => node.id !== selectedNode.id));
                  setEdges(edges.filter(edge => 
                    edge.source !== selectedNode.id && edge.target !== selectedNode.id
                  ));
                  setSelectedNode(null);
                }}
              >
                Remove
              </button>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
} 