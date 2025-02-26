import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import {
  Box,
  Stack,
  Text,
  Flex,
  Icon,
  HStack,
  Tag,
  Divider,
  Input,
  IconButton,
  Textarea
} from '@chakra-ui/react';
import { ChatIcon, TimeIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { BsGraphUp } from 'react-icons/bs';

const handleStyle = {
  width: '10px',
  height: '10px',
  backgroundColor: '#4CD964',
  border: '1px solid #2D3748',
  borderRadius: '50%',
  cursor: 'crosshair',
  zIndex: 1
};

const MetricNode = ({ data, id }) => {
  const [localData, setLocalData] = useState(data);

  const updateField = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    
    // Trigger an event to notify App.js that node data has been updated
    const customEvent = new CustomEvent('node:update', { 
      detail: { id, data: newData } 
    });
    window.dispatchEvent(customEvent);
  };

  const updateMetric = (index, field, value) => {
    const updatedMetrics = [...localData.metrics];
    updatedMetrics[index] = { 
      ...updatedMetrics[index], 
      [field]: value 
    };
    
    updateField('metrics', updatedMetrics);
  };

  const handleDuplicate = () => {
    const customEvent = new CustomEvent('node:duplicate', { 
      detail: { id, type: 'metric', data: localData } 
    });
    window.dispatchEvent(customEvent);
  };

  const handleDelete = () => {
    const customEvent = new CustomEvent('node:delete', { 
      detail: { id } 
    });
    window.dispatchEvent(customEvent);
  };

  return (
    <Box 
      className="metric-node" 
      bg="#14151E" 
      borderRadius="md" 
      p={3} 
      minW="250px"
      maxW="260px"
      position="relative"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      border="1px solid #2D2F3E"
    >
      {/* Duplicate Button */}
      <IconButton
        icon={<AddIcon />}
        size="xs"
        aria-label="Duplicate node"
        position="absolute"
        top="-8px"
        right="-8px"
        colorScheme="blue"
        borderRadius="full"
        onClick={handleDuplicate}
        className="nodrag"
        zIndex={10}
      />
      
      {/* Delete Button */}
      <IconButton
        icon={<CloseIcon />}
        size="xs"
        aria-label="Delete node"
        position="absolute"
        top="-8px"
        left="-8px"
        colorScheme="red"
        borderRadius="full"
        onClick={handleDelete}
        className="nodrag"
        zIndex={10}
      />

      <Handle
        id="top"
        type="target"
        position={Position.Top}
        style={handleStyle}
        isConnectable={true}
        isValidConnection={() => true}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={handleStyle}
        isConnectable={true}
        isValidConnection={() => true}
        onConnect={(params) => console.log('handle onConnect', params)}
      />

      {/* Header with Tag */}
      <HStack mb={2} spacing={1}>
        <TimeIcon color="gray.400" w={3} h={3} />
        <Text color="gray.400" fontSize="xs">Metric /</Text>
        <Text color="gray.300" fontSize="xs">{ localData.aggregation === 'Average' ? 'KPI' : 'Input' }</Text>
      </HStack>

      {/* Title */}
      <Input 
        fontSize="md" 
        fontWeight="bold" 
        color="gray.300" 
        mb={3}
        border="none"
        bg="transparent"
        value={localData.name}
        onChange={(e) => updateField('name', e.target.value)}
        className="nodrag"
        _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
      />

      {/* Metrics Grid */}
      <Flex justify="space-between" mb={3} flexWrap="wrap">
        {localData.metrics.map((metric, index) => (
          <Box key={index} fontSize="sm" mb={2}>
            <Input 
              color="gray.400" 
              fontSize="xs" 
              mb={1}
              border="none"
              bg="transparent"
              value={metric.period}
              onChange={(e) => updateMetric(index, 'period', e.target.value)}
              className="nodrag"
              size="xs"
              _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
            />
            <Input 
              fontSize="xs" 
              fontWeight="medium" 
              color="white" 
              mb={1}
              border="none"
              bg="transparent"
              value={metric.value}
              onChange={(e) => updateMetric(index, 'value', e.target.value)}
              className="nodrag"
              size="xs"
              _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
            />
            <HStack spacing={1}>
              <Text fontSize="2xs" color={metric.change >= 0 ? "green.400" : "red.400"}>
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </Text>
              <Icon
                as={BsGraphUp}
                color={metric.change >= 0 ? "green.400" : "red.400"}
                transform={metric.change >= 0 ? "rotate(0deg)" : "rotate(180deg)"}
                w={2}
                h={2}
              />
            </HStack>
          </Box>
        ))}
      </Flex>

      {/* Footer */}
      <Divider borderColor="gray.700" mb={2} />
      <HStack spacing={3} color="gray.400">
        <HStack spacing={1}>
          <ChatIcon w={3} h={3} />
          <Input
            fontSize="xs"
            border="none"
            bg="transparent"
            value={localData.comments}
            onChange={(e) => updateField('comments', parseInt(e.target.value) || 0)}
            width="20px"
            className="nodrag"
            size="xs"
            _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
          />
        </HStack>
        <Icon as={BsGraphUp} w={3} h={3} />
        <Input
          fontSize="xs"
          fontWeight="normal"
          border="none"
          bg="transparent"
          value={localData.aggregation}
          onChange={(e) => updateField('aggregation', e.target.value)}
          className="nodrag"
          size="xs"
          _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
        />
      </HStack>

      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={handleStyle}
        isConnectable={true}
        isValidConnection={() => true}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        isConnectable={true}
        isValidConnection={() => true}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </Box>
  );
};

export default MetricNode; 