import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Controls, 
  Panel, 
  MarkerType,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeLabelRenderer,
  BaseEdge,
  getStraightPath,
  getBezierPath
} from 'reactflow';
import { 
  ChakraProvider, 
  extendTheme,
  Button,
  Stack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Icon,
  IconButton
} from '@chakra-ui/react';
import { 
  ChatIcon, 
  AddIcon, 
  MinusIcon, 
  ViewIcon,
  HamburgerIcon,
  DeleteIcon,
  CloseIcon
} from '@chakra-ui/icons';
import 'reactflow/dist/style.css';
import './styles.css';

// Custom nodes
import EntityNode from './components/EntityNode';
import MetricNode from './components/MetricNode';
import BasicCardNode from './components/BasicCardNode';

// Get the base path for GitHub Pages
// This ensures assets are loaded correctly when deployed to a subdirectory
const getBasePath = () => {
  // When running locally, use an empty string
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  // When deployed to GitHub Pages, use the repository name as the base path
  const repoName = process.env.PUBLIC_URL || '';
  return repoName;
};

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

const nodeTypes = {
  entity: EntityNode,
  metric: MetricNode,
  basicCard: BasicCardNode,
};

const initialNodes = [
  // Bet nodes (left side)
  {
    id: 'bet1',
    type: 'basicCard',
    position: { x: -1200, y: 200 },
    draggable: true,
    data: {
      name: 'Launch push notifications',
      hypothesis: 'Push notifications will entice users to come back to our app more frequently.',
      status: 'Active',
      comments: 0,
      experiments: [{ name: 'Ivory slot' }]
    }
  },
  {
    id: 'bet2',
    type: 'basicCard',
    position: { x: -1200, y: 800 },
    draggable: true,
    data: {
      name: 'Improve song recommendations',
      hypothesis: 'By improving song recommendations, users will spend more time listening to music in each session.',
      status: 'Active',
      comments: 0,
      experiments: []
    }
  },

  // Work/Task nodes (middle)
  {
    id: 'work1',
    type: 'entity',
    position: { x: -600, y: 0 },
    draggable: true,
    data: {
      sourceName: 'web',
      name: 'New marketing campaign',
      issues: 5,
      progress: 67,
      status: 'In progress',
      comments: 0
    }
  },
  {
    id: 'work2',
    type: 'entity',
    position: { x: -600, y: 300 },
    draggable: true,
    data: {
      sourceName: 'web',
      name: 'Social notifications',
      issues: 4,
      progress: 50,
      status: 'In progress',
      comments: 0
    }
  },
  {
    id: 'work3',
    type: 'entity',
    position: { x: -600, y: 600 },
    draggable: true,
    data: {
      sourceName: 'web',
      name: 'Time-based notifications',
      issues: 1,
      progress: 100,
      status: 'Done',
      comments: 0
    }
  },
  {
    id: 'work4',
    type: 'entity',
    position: { x: -600, y: 900 },
    draggable: true,
    data: {
      sourceName: 'jira',
      name: 'AI model for song recommendations',
      issues: 4,
      progress: 25,
      status: 'In progress',
      comments: 0
    }
  },
  {
    id: 'work5',
    type: 'entity',
    position: { x: -600, y: 1200 },
    draggable: true,
    data: {
      sourceName: 'web',
      name: 'More prominent sharing prompts',
      issues: 3,
      progress: 50,
      status: 'In progress',
      comments: 0
    }
  },

  // Metric nodes (first column)
  {
    id: 'metric1',
    type: 'metric',
    position: { x: 0, y: 0 },
    draggable: true,
    data: {
      name: 'Premium trial users',
      metrics: [
        { period: 'Past 7 days', value: '5,674', change: 0.35 },
        { period: 'Past 6 weeks', value: '33,779', change: 2.32 },
        { period: 'Past 12 months', value: '168,608', change: -25.24 }
      ],
      comments: 0,
      aggregation: 'Sum'
    }
  },
  {
    id: 'metric2',
    type: 'metric',
    position: { x: 0, y: 300 },
    draggable: true,
    data: {
      name: 'Avg. sessions per week',
      metrics: [
        { period: 'Past 7 days', value: '808.92', change: 0.57 },
        { period: 'Past 6 weeks', value: '800.63', change: 1.26 },
        { period: 'Past 12 months', value: '749.86', change: 21.79 }
      ],
      comments: 0,
      aggregation: 'Average'
    }
  },
  {
    id: 'metric3',
    type: 'metric',
    position: { x: 0, y: 600 },
    draggable: true,
    data: {
      name: 'Average session duration',
      metrics: [
        { period: 'MTD', value: '0', change: 0 },
        { period: 'QTD', value: '0', change: 0 },
        { period: 'YTD', value: '0', change: -100 }
      ],
      comments: 0,
      aggregation: 'Sum'
    }
  },
  {
    id: 'metric4',
    type: 'metric',
    position: { x: 0, y: 900 },
    draggable: true,
    data: {
      name: 'Avg. shares per session',
      metrics: [
        { period: 'Past 7 days', value: '879.02', change: 0.68 },
        { period: 'Past 6 weeks', value: '869.18', change: 1.99 },
        { period: 'Past 12 months', value: '797.14', change: 25.72 }
      ],
      comments: 0,
      aggregation: 'Average'
    }
  },

  // Metric nodes (second column)
  {
    id: 'metric5',
    type: 'metric',
    position: { x: 600, y: 450 },
    draggable: true,
    data: {
      name: 'Time spent listening to music by subscribers',
      metrics: [
        { period: 'Past 7 days', value: '5.82K mins', change: 0.61 },
        { period: 'Past 6 weeks', value: '34.41K mins', change: 3.03 },
        { period: 'Past 12 months', value: '262.48K mins', change: 22.18 }
      ],
      comments: 0,
      aggregation: 'Sum'
    }
  },

  // Metric nodes (third column)
  {
    id: 'metric6',
    type: 'metric',
    position: { x: 1200, y: 0 },
    draggable: true,
    data: {
      name: 'ARR',
      metrics: [
        { period: 'Past 7 days', value: '0', change: 100 },
        { period: 'Past 6 weeks', value: '-US$7,344', change: 0 },
        { period: 'Past 12 months', value: '-US$51,240', change: -159.32 }
      ],
      comments: 0,
      aggregation: 'Amount increased'
    }
  },
  {
    id: 'metric7',
    type: 'metric',
    position: { x: 1200, y: 450 },
    draggable: true,
    data: {
      name: 'Monthly retention',
      metrics: [
        { period: 'Past 7 days', value: '92,259.03%', change: 0.24 },
        { period: 'Past 6 weeks', value: '91,746.69%', change: 2.01 },
        { period: 'Past 12 months', value: '85,957.90%', change: 24.22 }
      ],
      comments: 0,
      aggregation: 'Average'
    }
  },
  {
    id: 'metric8',
    type: 'metric',
    position: { x: 1200, y: 900 },
    draggable: true,
    data: {
      name: 'Monthly premium subscriptions',
      metrics: [
        { period: 'Past 7 days', value: '6,430.66', change: 0.39 },
        { period: 'Past 6 weeks', value: '35,448.03', change: 2.85 },
        { period: 'Past 12 months', value: '299,024.49', change: 28.04 }
      ],
      comments: 0,
      aggregation: 'Sum'
    }
  }
];

const initialEdges = [
  // Connections from Launch push notifications to Social notifications and Time-based notifications
  { 
    id: 'bet1-work2', 
    source: 'bet1', 
    target: 'work2', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },
  { 
    id: 'bet1-work3', 
    source: 'bet1', 
    target: 'work3', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },

  // Connection from Improve song recommendations to AI model for song recommendations
  { 
    id: 'bet2-work4', 
    source: 'bet2', 
    target: 'work4', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },

  // Connections from Work items to Metrics
  { 
    id: 'work1-metric1', 
    source: 'work1', 
    target: 'metric1', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },
  { 
    id: 'work2-metric2', 
    source: 'work2', 
    target: 'metric2', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },
  { 
    id: 'work3-metric2', 
    source: 'work3', 
    target: 'metric2', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },
  { 
    id: 'work4-metric3', 
    source: 'work4', 
    target: 'metric3', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },
  { 
    id: 'work5-metric4', 
    source: 'work5', 
    target: 'metric4', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      strokeWidth: 2,
      stroke: '#666',
      strokeDasharray: '4 4'
    }
  },

  // Connections between Metrics
  { 
    id: 'metric1-metric5', 
    source: 'metric1', 
    target: 'metric5', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: 0.999 },
    style: { 
      strokeWidth: 2,
      stroke: '#4CD964',
      strokeOpacity: 0.7
    }
  },
  { 
    id: 'metric2-metric5', 
    source: 'metric2', 
    target: 'metric5', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: 0.711 },
    style: { 
      strokeWidth: 2,
      stroke: '#4CD964',
      strokeOpacity: 0.7
    }
  },
  { 
    id: 'metric3-metric5', 
    source: 'metric3', 
    target: 'metric5', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: -0.644 },
    style: { 
      strokeWidth: 2,
      stroke: '#E53E3E',
      strokeOpacity: 0.7
    }
  },
  { 
    id: 'metric4-metric5', 
    source: 'metric4', 
    target: 'metric5', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: 0.999 },
    style: { 
      strokeWidth: 2,
      stroke: '#4CD964',
      strokeOpacity: 0.7
    }
  },
  
  // Connections from Time Spent Listening to final metrics
  { 
    id: 'metric5-metric6', 
    source: 'metric5', 
    target: 'metric6', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: 0.999 },
    style: { 
      strokeWidth: 2,
      stroke: '#4CD964',
      strokeOpacity: 0.7
    }
  },
  { 
    id: 'metric5-metric7', 
    source: 'metric5', 
    target: 'metric7', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: 0.999 },
    style: { 
      strokeWidth: 2,
      stroke: '#4CD964',
      strokeOpacity: 0.7
    }
  },
  { 
    id: 'metric5-metric8', 
    source: 'metric5', 
    target: 'metric8', 
    type: 'custom',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    data: { value: 0.999 },
    style: { 
      strokeWidth: 2,
      stroke: '#4CD964',
      strokeOpacity: 0.7
    }
  }
];

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  
  // Default value if not provided
  const edgeValue = data?.value || null;
  const isPositive = edgeValue === null ? true : edgeValue >= 0;
  const edgeColor = isPositive ? '#4CD964' : '#E53E3E';
  const formattedValue = edgeValue?.toFixed(3) || '';

  return (
    <g
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
      className="react-flow__edge-custom"
    >
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeOpacity: 0.7,
          strokeWidth: 2
        }}
      />
      
      {edgeValue !== null && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: edgeColor,
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: 12,
              fontWeight: 600,
              color: 'white',
              pointerEvents: 'all',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            className="nodrag nopan"
          >
            {formattedValue}
          </div>
        </EdgeLabelRenderer>
      )}

      {showDeleteButton && (
        <foreignObject
          width={20}
          height={20}
          x={(sourceX + targetX) / 2 - 10}
          y={(sourceY + targetY) / 2 - 10 - 20} // Move it above the edge
          className="edge-button-container"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="edge-button">
            <IconButton
              aria-label="Delete connection"
              icon={<CloseIcon />}
              size="xs"
              colorScheme="red"
              className="edge-delete-button"
              onClick={(event) => {
                event.stopPropagation();
                const customEvent = new CustomEvent('edge:delete', { detail: { id } });
                window.dispatchEvent(customEvent);
              }}
            />
          </div>
        </foreignObject>
      )}
    </g>
  );
};

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}-${params.sourceHandle || ''}-${params.targetHandle || ''}`,
        type: 'custom',
        animated: true,
        data: { value: parseFloat((Math.random() * 1.5 - 0.3).toFixed(3)) }, // Random value between -0.3 and 1.2
        style: { 
          strokeWidth: 2,
          stroke: '#666',
          strokeDasharray: '4 4'
        }
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    []
  );

  // Edge delete handler
  React.useEffect(() => {
    const onEdgeDelete = (event) => {
      const edgeId = event.detail.id;
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    };

    window.addEventListener('edge:delete', onEdgeDelete);
    return () => window.removeEventListener('edge:delete', onEdgeDelete);
  }, []);

  // Node update handler
  React.useEffect(() => {
    const onNodeUpdate = (event) => {
      const { id, data } = event.detail;
      
      setNodes((nds) => 
        nds.map((node) => {
          if (node.id === id) {
            return { ...node, data };
          }
          return node;
        })
      );
    };

    window.addEventListener('node:update', onNodeUpdate);
    return () => window.removeEventListener('node:update', onNodeUpdate);
  }, []);

  // Node duplication handler
  React.useEffect(() => {
    const onNodeDuplicate = (event) => {
      const { id, type, data } = event.detail;
      
      // Find the original node to get its position
      const sourceNode = nodes.find(node => node.id === id);
      if (!sourceNode) return;
      
      // Create a new unique ID
      const newId = `${type}-${Date.now()}`;
      
      // Create a new node with an offset position
      const newNode = {
        id: newId,
        type,
        position: { 
          x: sourceNode.position.x + 50, 
          y: sourceNode.position.y + 50 
        },
        draggable: true,
        data: { ...data }
      };
      
      setNodes((nds) => [...nds, newNode]);
    };

    window.addEventListener('node:duplicate', onNodeDuplicate);
    return () => window.removeEventListener('node:duplicate', onNodeDuplicate);
  }, [nodes]);

  // Node delete handler
  React.useEffect(() => {
    const onNodeDelete = (event) => {
      const { id } = event.detail;
      
      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== id));
      
      // Remove any connected edges
      setEdges((eds) => eds.filter(
        (edge) => edge.source !== id && edge.target !== id
      ));
    };

    window.addEventListener('node:delete', onNodeDelete);
    return () => window.removeEventListener('node:delete', onNodeDelete);
  }, []);

  // Function to create a new node
  const createNewNode = (type) => {
    // Default position in center of viewport
    const position = { x: 0, y: 0 };
    
    // Create new node data based on type
    let data = {};
    let newId = `${type}-${Date.now()}`;
    
    switch (type) {
      case 'metric':
        data = {
          name: 'New Metric',
          metrics: [
            { period: 'Past 7 days', value: '0', change: 0 },
            { period: 'Past 6 weeks', value: '0', change: 0 },
            { period: 'Past 12 months', value: '0', change: 0 }
          ],
          comments: 0,
          aggregation: 'Sum'
        };
        break;
      case 'entity':
        data = {
          sourceName: 'web',
          name: 'New Task',
          issues: 0,
          progress: 0,
          status: 'To Do',
          comments: 0
        };
        break;
      case 'basicCard':
        data = {
          name: 'New Bet',
          hypothesis: 'Enter your hypothesis here',
          status: 'Draft',
          comments: 0,
          experiments: []
        };
        break;
      default:
        break;
    }
    
    const newNode = {
      id: newId,
      type,
      position,
      draggable: true,
      data
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  return (
    <ChakraProvider theme={theme}>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1A1B22' }} className="dark">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'custom',
            animated: true,
            style: { 
              strokeWidth: 2,
              stroke: '#666',
              strokeDasharray: '4 4'
            }
          }}
          proOptions={{ account: 'paid-pro', baseUrl: getBasePath() }}
          snapToGrid={true}
          snapGrid={[15, 15]}
          connectionMode="loose"
          onConnect={onConnect}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.25 }}
        >
          <Background color="#333" variant="dots" gap={16} size={1} />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'basicCard':
                  return '#553C9A';
                case 'entity':
                  return '#2C5282';
                default:
                  return '#234E52';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.2)"
            style={{
              backgroundColor: '#1A202C'
            }}
          />
          <Controls />
          <Panel position="top-left">
            <Stack direction="row" spacing={2} className="css-neauw2" mb={2}>
              <Text fontWeight="bold" color="white">Add Node:</Text>
              <Button size="sm" colorScheme="purple" onClick={() => createNewNode('basicCard')}>
                +Bet
              </Button>
              <Button size="sm" colorScheme="blue" onClick={() => createNewNode('entity')}>
                +Task
              </Button>
              <Button size="sm" colorScheme="teal" onClick={() => createNewNode('metric')}>
                +Metric
              </Button>
            </Stack>
          </Panel>
          <Panel position="bottom-right">
            <Stack direction="row" spacing={2} className="css-neauw2">
              <Tooltip label="AI Assistants">
                <Menu>
                  <MenuButton as={Button} className="css-1dpvzx1">
                    <Stack direction="row" spacing={2}>
                      <ChatIcon />
                      <Text>AI</Text>
                    </Stack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Data scientist</MenuItem>
                    <MenuItem>KPI tree generator</MenuItem>
                    <MenuItem>Corporate strategy generator</MenuItem>
                    <MenuItem>Northstar playbook</MenuItem>
                  </MenuList>
                </Menu>
              </Tooltip>
              
              <Stack direction="row" spacing={2} className="css-qcr6k0">
                <Tooltip label="Zoom in">
                  <Button className="css-1dpvzx1">
                    <AddIcon />
                  </Button>
                </Tooltip>
                <Tooltip label="Zoom out">
                  <Button className="css-1dpvzx1">
                    <MinusIcon />
                  </Button>
                </Tooltip>
                <Tooltip label="Fit view">
                  <Button className="css-1dpvzx1">
                    <ViewIcon />
                  </Button>
                </Tooltip>
              </Stack>

              <Menu>
                <MenuButton as={Button} className="css-3e79hg">
                  <HamburgerIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem>Relayout</MenuItem>
                  <MenuItem>
                    <Button leftIcon={<Icon viewBox="0 0 16 16" />}>
                      Hide metric data
                    </Button>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Panel>
        </ReactFlow>
      </div>
    </ChakraProvider>
  );
}

export default App; 