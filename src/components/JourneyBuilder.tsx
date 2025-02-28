'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  NodeTypes,
  useReactFlow,
  EdgeTypes,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import AddNodeMenu from './AddNodeMenu';
import EdgeWithPlusButton from './EdgeWithPlusButton';

// Import our custom node components
import EntranceNode from './notification-nodes/EntranceNode';
import PushNotificationNode from './notification-nodes/PushNotificationNode';
import EmailNode from './notification-nodes/EmailNode';
import SMSNode from './notification-nodes/SMSNode';
import InAppNode from './notification-nodes/InAppNode';
import WaitNode from './notification-nodes/WaitNode';
import BranchNode from './notification-nodes/BranchNode';
import SplitBranchNode from './notification-nodes/SplitBranchNode';
import FilterNode from './notification-nodes/FilterNode';
import OutcomeNode from './notification-nodes/OutcomeNode';
import WebhookNode from './notification-nodes/WebhookNode';
import ExitNode from './notification-nodes/ExitNode';
import NodeConfigPanel from './NodeConfigPanel';
import AIJourneyPrompt from './AIJourneyPrompt';

// Define node types mapping
const nodeTypes: NodeTypes = {
  entrance: EntranceNode,
  push: PushNotificationNode,
  email: EmailNode,
  sms: SMSNode,
  inApp: InAppNode,
  wait: WaitNode,
  branch: BranchNode,
  split: SplitBranchNode,
  filter: FilterNode,
  outcome: OutcomeNode,
  webhook: WebhookNode,
  exit: ExitNode,
};

// Define edge types mapping
const edgeTypes: EdgeTypes = {
  plusButton: EdgeWithPlusButton,
};

// Initial nodes based on the OneSignal-like UI
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'entrance',
    position: { x: 400, y: 0 },
    data: { 
      label: 'Entrance',
      trigger: 'Audience Segment',
      startCondition: 'Immediately',
      filterCondition: '',
      status: 'incomplete',
    },
  },
  {
    id: '2',
    type: 'push',
    position: { x: 400, y: 180 },
    data: { 
      label: 'Push Notification',
      message: 'Welcome to our app!',
      status: 'incomplete',
    },
  },
  {
    id: '3',
    type: 'wait',
    position: { x: 400, y: 360 },
    data: { 
      label: 'Wait',
      duration: '3 Days',
    },
  },
  {
    id: '4',
    type: 'branch',
    position: { x: 400, y: 540 },
    data: { 
      label: 'Yes/No Branch',
      condition: 'Did user complete purchase?',
    },
  },
  {
    id: '5',
    type: 'push',
    position: { x: 200, y: 720 },
    data: { 
      label: 'Push Notification',
      message: 'We miss you! Come back and check out new features.',
      status: 'incomplete',
    },
  },
  {
    id: '6',
    type: 'email',
    position: { x: 600, y: 720 },
    data: { 
      label: 'Email',
      subject: 'Thanks for being active!',
      template: 'active-user-reward',
      status: 'incomplete',
    },
  },
  {
    id: '7',
    type: 'exit',
    position: { x: 400, y: 900 },
    data: { 
      label: 'Exit',
      exitRules: [
        'User has received all messages or',
        'User becomes active or',
        'User no longer matches audience conditions'
      ],
      reEntryRules: [
        'Users can only enter the Journey once'
      ],
      stopCondition: 'Never',
    },
  },
];

// Initial edges with labels for the branches
const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3',
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4',
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e4-5', 
    source: '4', 
    target: '5',
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
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
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
    label: 'Yes',
    labelStyle: { fill: '#888', fontWeight: 500 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e5-7', 
    source: '5', 
    target: '7',
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e6-7', 
    source: '6', 
    target: '7',
    type: 'plusButton',
    data: {
      onPlusClick: undefined, // Will be set in the component
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

// Node types available for adding to the journey
const availableNodeTypes = [
  { type: 'push', label: 'Push Notification', category: 'message' },
  { type: 'email', label: 'Email', category: 'message' },
  { type: 'sms', label: 'SMS', category: 'message' },
  { type: 'inApp', label: 'In-App Message', category: 'message' },
  { type: 'wait', label: 'Wait', category: 'flow' },
  { type: 'branch', label: 'Yes/No Branch', category: 'flow' },
  { type: 'split', label: 'Split', category: 'flow' },
  { type: 'outcome', label: 'Outcome', category: 'flow' },
  { type: 'webhook', label: 'Webhook', category: 'integration' },
];

interface JourneyBuilderProps {
  className?: string;
  onJourneyChange?: (nodes: Node[], edges: Edge[]) => void;
}

// Wrapper component to provide ReactFlow context
export default function JourneyBuilderWrapper({ className = '', onJourneyChange }: JourneyBuilderProps) {
  return (
    <ReactFlowProvider>
      <JourneyBuilder className={className} onJourneyChange={onJourneyChange} />
    </ReactFlowProvider>
  );
}

function JourneyBuilder({ className = '', onJourneyChange }: JourneyBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeConfigOpen, setNodeConfigOpen] = useState(false);
  const [nodeCategory, setNodeCategory] = useState<'all' | 'message' | 'flow' | 'integration'>('all');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const reactFlowInstance = useReactFlow();
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [isGeneratingJourney, setIsGeneratingJourney] = useState(false);

  // Notify parent component when journey changes
  useEffect(() => {
    if (onJourneyChange) {
      onJourneyChange(nodes, edges);
    }
  }, [nodes, edges, onJourneyChange]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({
      ...connection,
      type: 'plusButton',
      data: {
        onPlusClick: undefined, // Will be set after edges are updated
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
    setNodeConfigOpen(true);
  }, []);

  // Add a new node of the specified type at the menu position
  const addNodeAtPosition = useCallback((type: string) => {
    const newNodeId = `node-${nodes.length + 1}`;
    const label = availableNodeTypes.find(nt => nt.type === type)?.label || 'New Node';
    
    // Use the menu position for the new node
    // Ensure there's enough vertical spacing (at least 180px) between nodes
    const position = {
      x: menuPosition.x,
      y: menuPosition.y
    };
    
    // If this node is being added from a selected node, ensure proper spacing
    if (selectedNode) {
      // Calculate vertical distance from the selected node
      const selectedNodeY = selectedNode.position.y;
      // Ensure at least 180px vertical spacing
      if (Math.abs(position.y - selectedNodeY) < 180) {
        position.y = selectedNodeY + 180;
      }
    }
    
    const newNode: Node = {
      id: newNodeId,
      type,
      position,
      data: { 
        label,
        status: 'incomplete',
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    // If a node is selected, create a connection from the selected node to the new node
    if (selectedNode) {
      const newEdge: Edge = {
        id: `e${selectedNode.id}-${newNodeId}`,
        source: selectedNode.id,
        target: newNodeId,
        type: 'plusButton',
      };
      
      setEdges((eds) => [...eds, newEdge]);
    }

    // Select the new node for configuration
    setSelectedNode(newNode);
    setNodeConfigOpen(true);
  }, [nodes, selectedNode, setNodes, setEdges, menuPosition]);

  // Handle background click to show the contextual menu
  const onPaneClick = useCallback((event: React.MouseEvent) => {
    // Get the position relative to the ReactFlow container
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (reactFlowBounds && reactFlowInstance) {
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      });
      
      setMenuPosition(position);
      setMenuOpen(true);
    }
  }, [reactFlowInstance]);

  // Update node data
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    console.log('JourneyBuilder updating node:', nodeId, 'with data:', newData);
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = { ...node.data, ...newData };
          console.log('Node data updated:', updatedData);
          return { ...node, data: updatedData };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Delete a node
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setNodeConfigOpen(false);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Filter nodes by category
  const filteredNodeTypes = availableNodeTypes.filter(
    nodeType => nodeCategory === 'all' || nodeType.category === nodeCategory
  );

  // Validate journey
  const validateJourney = useCallback(() => {
    // Check if all nodes have required data
    const invalidNodes = nodes.filter(node => {
      if (node.data.status === 'incomplete') {
        return true;
      }
      return false;
    });

    if (invalidNodes.length > 0) {
      alert(`Journey has ${invalidNodes.length} incomplete nodes. Please configure all nodes before activating.`);
      return false;
    }

    // Check if all nodes are connected
    const connectedNodeIds = new Set<string>();
    
    // Start with entrance nodes
    const entranceNodes = nodes.filter(node => node.type === 'entrance');
    entranceNodes.forEach(node => connectedNodeIds.add(node.id));
    
    // Follow all connections
    let newNodesAdded = true;
    while (newNodesAdded) {
      newNodesAdded = false;
      edges.forEach(edge => {
        if (connectedNodeIds.has(edge.source) && !connectedNodeIds.has(edge.target)) {
          connectedNodeIds.add(edge.target);
          newNodesAdded = true;
        }
      });
    }
    
    const disconnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
    if (disconnectedNodes.length > 0) {
      alert(`Journey has ${disconnectedNodes.length} disconnected nodes. All nodes must be connected to the flow.`);
      return false;
    }

    return true;
  }, [nodes, edges]);

  // Export journey as JSON
  const exportJourney = useCallback(() => {
    if (!validateJourney()) {
      return;
    }

    const journeyData = {
      nodes,
      edges,
      metadata: {
        version: '1.0',
        exportedAt: new Date().toISOString(),
      }
    };

    const dataStr = JSON.stringify(journeyData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `journey-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, validateJourney]);

  // Handle plus button click on edge
  const handlePlusButtonClick = useCallback((x: number, y: number, sourceNodeId: string) => {
    setMenuPosition({ x, y });
    setMenuOpen(true);
    // Optionally select the source node
    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    if (sourceNode) {
      setSelectedNode(sourceNode);
    }
  }, [nodes, setMenuPosition, setMenuOpen, setSelectedNode]);

  // Update edges with the plus button click handler
  useEffect(() => {
    setEdges((eds) => 
      eds.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          onPlusClick: handlePlusButtonClick,
        },
      }))
    );
  }, [handlePlusButtonClick, setEdges]);

  // Handle AI journey generation
  const handleGenerateJourney = async (prompt: string) => {
    setAiPromptOpen(false);
    setIsGeneratingJourney(true);
    console.log('Starting journey generation with prompt:', prompt);
    
    try {
      console.log('Sending request to /api/generate-journey');
      const response = await fetch('/api/generate-journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', response.status, errorText);
        throw new Error(`Failed to generate journey: ${response.status} ${errorText}`);
      }
      
      console.log('Received response from API');
      const data = await response.json();
      console.log('Parsed response data:', data);
      
      if (data.journey) {
        console.log('Journey data received, clearing existing nodes and edges');
        // Clear existing nodes and edges
        setNodes([]);
        setEdges([]);
        
        // Add the new nodes and edges with a slight delay to ensure the canvas is cleared first
        setTimeout(() => {
          console.log('Creating organized layout for journey');
          // Create a more organized layout for the journey
          const organizedJourney = organizeJourneyLayout(data.journey);
          console.log('Organized journey:', organizedJourney);
          
          setNodes(organizedJourney.nodes);
          setEdges(organizedJourney.edges);
          
          // Fit view to show all nodes
          setTimeout(() => {
            console.log('Fitting view to show all nodes');
            reactFlowInstance.fitView({ padding: 0.2 });
          }, 100);
        }, 100);
      } else {
        console.error('No journey data in response:', data);
        alert('Failed to generate journey: No journey data received');
      }
    } catch (error) {
      console.error('Error generating journey:', error);
      alert(`Failed to generate journey: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingJourney(false);
    }
  };

  // Function to organize journey layout in a vertical, centered, and symmetrical way
  const organizeJourneyLayout = (journey: any) => {
    const { nodes: originalNodes, edges: originalEdges } = journey;
    
    // Create a map of nodes by id for quick access
    const nodeMap = new Map();
    originalNodes.forEach((node: any) => {
      nodeMap.set(node.id, { ...node });
    });
    
    // Find the entrance node (root)
    const entranceNode = originalNodes.find((node: any) => node.type === 'entrance');
    if (!entranceNode) return journey; // Return original if no entrance node
    
    // Ensure entrance node has filterCondition field if not present
    if (entranceNode && entranceNode.data && !entranceNode.data.hasOwnProperty('filterCondition')) {
      entranceNode.data.filterCondition = '';
    }
    
    // Center X position for the main flow - use viewport width/2 for better centering
    const centerX = 400; // This is our default center
    const verticalSpacing = 220; // Increased space between vertical nodes (was 180)
    const horizontalSpacing = 300; // Space between parallel branches
    
    // Build a graph representation of the journey
    const graph: Record<string, string[]> = {};
    const reverseGraph: Record<string, string[]> = {}; // For tracking parents
    originalEdges.forEach((edge: any) => {
      if (!graph[edge.source]) {
        graph[edge.source] = [];
      }
      graph[edge.source].push(edge.target);
      
      // Build reverse graph (child -> parent)
      if (!reverseGraph[edge.target]) {
        reverseGraph[edge.target] = [];
      }
      reverseGraph[edge.target].push(edge.source);
    });
    
    // Track processed nodes to avoid duplicates
    const processedNodes = new Set<string>();
    
    // Track node levels for vertical positioning
    const nodeLevels: Record<string, number> = {};
    
    // Assign levels to nodes (BFS traversal)
    const queue = [{ id: entranceNode.id, level: 0 }];
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      
      if (processedNodes.has(id)) continue;
      processedNodes.add(id);
      
      nodeLevels[id] = level;
      
      // Add children to queue
      const children = graph[id] || [];
      children.forEach(childId => {
        queue.push({ id: childId, level: level + 1 });
      });
    }
    
    // Reset processed nodes for the next phase
    processedNodes.clear();
    
    // Track horizontal positions for each node
    const nodePositions: Record<string, { x: number, y: number }> = {};
    
    // Function to assign positions to nodes and their children
    const assignPositions = (nodeId: string, x: number, level: number) => {
      if (processedNodes.has(nodeId)) return;
      processedNodes.add(nodeId);
      
      const node = nodeMap.get(nodeId);
      if (!node) return;
      
      // Assign position
      const y = level * verticalSpacing;
      nodePositions[nodeId] = { x, y };
      
      // Get children
      const children = graph[nodeId] || [];
      
      // Special handling for branch nodes (Yes/No branches)
      if (node.type === 'branch' || node.type === 'split') {
        // For branch nodes, position children to left and right
        const childCount = children.length;
        
        if (childCount === 1) {
          // If only one child, keep it centered
          assignPositions(children[0], x, level + 1);
        } else if (childCount === 2) {
          // If two children (typical Yes/No), position left and right
          assignPositions(children[0], x - horizontalSpacing, level + 1); // No/False path
          assignPositions(children[1], x + horizontalSpacing, level + 1); // Yes/True path
        } else {
          // For more than 2 children, distribute them evenly
          const totalWidth = (childCount - 1) * horizontalSpacing;
          const startX = x - totalWidth / 2;
          
          children.forEach((childId, index) => {
            const childX = startX + index * horizontalSpacing;
            assignPositions(childId, childX, level + 1);
          });
        }
      } else {
        // For non-branch nodes, keep children centered
        if (children.length === 1) {
          // Single child stays aligned with parent
          assignPositions(children[0], x, level + 1);
        } else if (children.length > 1) {
          // Multiple children are distributed horizontally
          const totalWidth = (children.length - 1) * horizontalSpacing;
          const startX = x - totalWidth / 2;
          
          children.forEach((childId, index) => {
            const childX = startX + index * horizontalSpacing;
            assignPositions(childId, childX, level + 1);
          });
        }
      }
    };
    
    // Start assigning positions from the entrance node
    assignPositions(entranceNode.id, centerX, 0);
    
    // Post-processing to improve alignment of reconnecting branches
    // Find nodes that have multiple parents (reconnection points)
    const reconnectionNodes = Object.entries(reverseGraph)
      .filter(([nodeId, parents]) => parents.length > 1)
      .map(([nodeId]) => nodeId);
    
    // For each reconnection node, check if we should center it
    reconnectionNodes.forEach(nodeId => {
      const parents = reverseGraph[nodeId];
      // If all parents are at the same level, center the reconnection node
      const parentLevels = parents.map(p => nodeLevels[p]);
      const allSameLevel = parentLevels.every(l => l === parentLevels[0]);
      
      if (allSameLevel) {
        // Calculate average X position of parents
        const avgX = parents.reduce((sum, p) => sum + (nodePositions[p]?.x || centerX), 0) / parents.length;
        // Update position
        if (nodePositions[nodeId]) {
          nodePositions[nodeId].x = centerX; // Force center alignment for reconnection nodes
        }
      }
    });
    
    // Ensure all nodes in the main path are centered
    Object.keys(nodePositions).forEach(nodeId => {
      const node = nodeMap.get(nodeId);
      if (!node) return;
      
      // If node has only one parent and one child, and is not part of a branch, center it
      const parents = reverseGraph[nodeId] || [];
      const children = graph[nodeId] || [];
      
      if (parents.length <= 1 && children.length <= 1 && node.type !== 'branch' && node.type !== 'split') {
        // Check if parent is a branch node
        const isPartOfBranch = parents.some(parentId => {
          const parentNode = nodeMap.get(parentId);
          return parentNode && (parentNode.type === 'branch' || parentNode.type === 'split');
        });
        
        // If not part of a branch, center it
        if (!isPartOfBranch) {
          nodePositions[nodeId].x = centerX;
        }
      }
    });
    
    // Create new nodes with updated positions
    const updatedNodes = originalNodes.map((node: any) => {
      const position = nodePositions[node.id] || { x: centerX, y: 0 };
      
      return {
        ...node,
        position,
        // Ensure data has required fields
        data: {
          ...node.data,
          status: node.data?.status || 'complete',
        },
      };
    });
    
    // Process edges to ensure they have the correct format for ReactFlow
    const updatedEdges = originalEdges.map((edge: any) => ({
      ...edge,
      // Add required properties for our custom edge type
      type: 'plusButton',
      data: {
        onPlusClick: handlePlusButtonClick,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));
    
    return {
      nodes: updatedNodes,
      edges: updatedEdges
    };
  };

  return (
    <div className="flex h-full">
      {/* Main Flow Area */}
      <div ref={reactFlowWrapper} className={`flex-1 ${className}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.4}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          edgesUpdatable={true}
          edgesFocusable={true}
          defaultEdgeOptions={{
            type: 'plusButton',
            style: { strokeWidth: 1.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          }}
          fitViewOptions={{
            padding: 0.3,
            includeHiddenNodes: false,
            minZoom: 0.5,
            maxZoom: 1.0,
          }}
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3} 
            zoomable 
            pannable 
            nodeBorderRadius={8}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          
          {/* Toolbar Panel - Removing redundant buttons */}
          <Panel position="top-right" className="flex gap-2">
            {/* Export button only */}
            <button
              onClick={exportJourney}
              className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export
            </button>
          </Panel>
          
          {/* AI Journey Button - Restoring this button */}
          <Panel position="top-left" className="mt-2 ml-2">
            <button
              onClick={() => setAiPromptOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700 border border-gray-200"
            >
              <div className="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path fill="white" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                  <path fill="white" d="M11 11h2v7.5h-2z" />
                  <path fill="white" d="M13 13v-2h-4v2h2z" />
                </svg>
              </div>
              <span>OneSignal Intelligence</span>
            </button>
          </Panel>
          
          {/* Loading overlay when generating journey */}
          {isGeneratingJourney && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                <svg className="animate-spin h-6 w-6 text-purple-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium text-gray-800">Generating your journey...</span>
              </div>
            </div>
          )}
        </ReactFlow>
        
        {/* Contextual Add Node Menu */}
        <AddNodeMenu
          isOpen={menuOpen}
          position={menuPosition}
          onClose={() => setMenuOpen(false)}
          onAddNode={addNodeAtPosition}
        />
        
        {/* AI Journey Prompt */}
        <AIJourneyPrompt
          isOpen={aiPromptOpen}
          onClose={() => setAiPromptOpen(false)}
          onGenerateJourney={handleGenerateJourney}
        />
      </div>
      
      {/* Side Panel for Node Configuration */}
      {selectedNode && nodeConfigOpen && (
        <div className="w-80 border-l border-gray-200 overflow-y-auto bg-white shadow-md">
          <NodeConfigPanel
            node={selectedNode}
            onClose={() => setNodeConfigOpen(false)}
            onUpdate={updateNodeData}
            onDelete={deleteNode}
          />
        </div>
      )}
    </div>
  );
} 