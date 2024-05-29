import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import './FlowBuilder.css';
import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';

// Define custom node and edge types
const nodeTypes = {
  customNode: CustomNode,
};
const edgeTypes = {
  floating: FloatingEdge,
};

// Initial node configuration
const initialElements = [
    {
        id: '1',
        type: 'customNode',
        position: { x: 250, y: 5 },
        data: { label: 'text message 1' },
    },
];

let id = 2;
const getId = () => `${id++}`; // Function to generate unique node IDs
const initialEdges = []; // Initial edges are empty

const FlowBuilder = () => {
  const [elements, setElements, onNodesChange] = useNodesState(initialElements); // State management for nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges); // State management for edges
  const [selectedNode, setSelectedNode] = useState(null); // State to track the selected node
  const reactFlowWrapper = useRef(null); // Ref to track the ReactFlow wrapper

  // Callback function to handle new connections (edges)
  const onConnect = useCallback((params) => {
      // Check if the target node already has an incoming edge
      const hasIncomingEdge = edges.some(edge => edge.source === params.source);
      if (hasIncomingEdge) {
          alert('A node cannot have more than one incoming edge.');
          return;
      }
      setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' }}, eds)); // Add new edge with arrow marker
  }, [edges, setEdges]);

  // Handle click on an element (node or edge)
  const onElementClick = (event, element) => {
      setSelectedNode(element);
  };

  // Update node label when text changes
  const onNodeTextChange = (text) => {
      const updatedElements = elements.map((el) =>
          el.id === selectedNode.id
              ? { ...el, data: { ...el.data, label: text } }
              : el
      );
      setElements(updatedElements);
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: text } });
  };

  // Handle drag over event to allow dropping
  const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
  };

  // Handle drop event to create a new node
  const onDrop = (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
      };
      const newNode = {
          id: getId(),
          type,
          position,
          data: { label: `text message ${id-1}` },
      };
      setElements((es) => [...es, newNode]);
  };

  // Save the flow, ensuring no node is left without a target handle
  const saveFlow = () => {
      const invalidNodes = elements.filter(
          (node) => node.type === 'customNode' && !edges.some(edge => edge.target === node.id)
      );
      if (invalidNodes.length > 1) {
          alert('Cannot save flow: More than one node has empty target handles.');
          return;
      }
      alert('Flow saved');
  };

  return (
      <div className="flow-builder">
          {!selectedNode ? (
              <NodesPanel /> // Display nodes panel if no node is selected
          ) : (
              <SettingsPanel
                  selectedNode={selectedNode}
                  onNodeTextChange={onNodeTextChange}
              />
          )}
          <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                  <ReactFlow
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      nodes={elements}
                      edges={edges}
                      onConnect={onConnect}
                      onNodeClick={onElementClick}
                      onPaneClick={() => { setSelectedNode(null); }}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                  >
                      <MiniMap />
                      <Controls />
                      <Background />
                  </ReactFlow>
              </div>
          </ReactFlowProvider>
          
          <button className="save-button" onClick={saveFlow}>
              Save Changes
          </button>
      </div>
  );
};

export default FlowBuilder;
