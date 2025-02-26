import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import {
  Box,
  Stack,
  Text,
  Divider,
  Icon,
  Button,
  Tag,
  Textarea,
  Link,
  Input,
  IconButton
} from '@chakra-ui/react';
import { InfoIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';

const handleStyle = {
  width: '10px',
  height: '10px',
  backgroundColor: '#4CD964',
  border: '1px solid #2D3748',
  borderRadius: '50%',
  cursor: 'crosshair',
  zIndex: 1
};

const BasicCardNode = ({ data, id }) => {
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

  const updateExperiment = (index, field, value) => {
    if (!localData.experiments) return;
    
    const updatedExperiments = [...localData.experiments];
    updatedExperiments[index] = { 
      ...updatedExperiments[index], 
      [field]: value 
    };
    
    updateField('experiments', updatedExperiments);
  };

  const handleDuplicate = () => {
    const customEvent = new CustomEvent('node:duplicate', { 
      detail: { id, type: 'basicCard', data: localData } 
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
      className="css-11ezchm" 
      position="relative"
      maxW="240px"
      minW="220px"
      bg="#23242F"
      borderRadius="md"
      p={3}
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
      <Box className="css-fta6td">
        <Stack className="css-15gfov3" spacing={1}>
          <Box className="css-10zlqzs">
            <Stack direction="row" className="css-1igwmid">
              <Stack direction="row" className="css-1igwmid">
                <Stack direction="row" className="css-1igwmid">
                  <Icon as={InfoIcon} className="css-a9qpxi" w={3} h={3} color="red.400" />
                  <Text className="css-1g69pad" fontSize="xs" color="red.400">Bet</Text>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Divider className="css-opvkbs" />
          <Box className="css-zgtese">
            <Stack className="css-1op6ogi" spacing={2}>
              <Textarea
                className="css-ltfe9u nodrag"
                value={localData.name}
                rows={1}
                fontSize="md"
                fontWeight="bold"
                color="gray.200"
                onChange={(e) => updateField('name', e.target.value)}
                border="none"
                _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                size="sm"
              />
              <Stack className="css-44c6y4">
                <Text className="css-1itkogl" fontSize="xs">Goal / Hypothesis</Text>
                <Box className="markdown-body css-mq9eh">
                  <Textarea 
                    fontSize="xs"
                    value={localData.hypothesis}
                    onChange={(e) => updateField('hypothesis', e.target.value)}
                    className="nodrag"
                    border="none"
                    bg="transparent"
                    color="gray.400"
                    _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                    size="xs"
                    minH="40px"
                    rows={2}
                  />
                </Box>
              </Stack>
              {localData.externalResource && (
                <Input
                  value={localData.externalResource}
                  onChange={(e) => updateField('externalResource', e.target.value)}
                  className="css-8eqi8x nodrag"
                  border="none"
                  _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                  size="xs"
                  color="blue.400"
                />
              )}
            </Stack>
          </Box>
          <Divider className="css-opvkbs" />
          <Box className="css-zgtese">
            <Stack direction="row" className="css-6cpqb8">
              <Box role="group" className="css-10t5ls7">
                <Button aria-label="Comments" className="css-hnkv22" size="xs">
                  {/* Comment icon */}
                </Button>
                <Input 
                  className="css-10j028m nodrag" 
                  fontSize="xs" 
                  value={localData.comments}
                  onChange={(e) => updateField('comments', parseInt(e.target.value) || 0)}
                  width="20px"
                  border="none"
                  bg="transparent"
                  color="gray.400"
                  _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                  size="xs"
                />
              </Box>
              <Input 
                className="css-sww0g2 nodrag"
                value={localData.status}
                onChange={(e) => updateField('status', e.target.value)}
                border="none"
                bg={localData.status === 'Active' ? '#4CD964' : '#4A5568'}
                color="white"
                _focus={{ boxShadow: 'none' }}
                size="xs"
                fontSize="xs"
                width="60px"
                textAlign="center"
                borderRadius="sm"
              />
            </Stack>
          </Box>
          <Divider className="css-opvkbs" />
          {localData.experiments && localData.experiments.length > 0 && (
            <Stack className="css-8g8ihq" spacing={1}>
              <Box className="css-zgtese">
                <Stack className="css-8g8ihq" spacing={1}>
                  <Stack direction="row" className="css-6cpqb8">
                    <Text className="css-1svm209" fontSize="xs" color="gray.400">Experiments</Text>
                  </Stack>
                  {localData.experiments.map((experiment, index) => (
                    <Stack key={index} className="css-8g8ihq" spacing={0}>
                      <Stack className="css-1hxnab7">
                        <Box className="css-8atqhb">
                          <Stack direction="row" className="css-1igwmid">
                            <Input 
                              className="css-1hrrvn nodrag" 
                              fontSize="xs"
                              value={experiment.name}
                              onChange={(e) => updateExperiment(index, 'name', e.target.value)}
                              border="none"
                              bg="transparent"
                              color="gray.400"
                              _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                              size="xs"
                            />
                            <Box className="css-xsawf1" />
                          </Stack>
                        </Box>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>
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

export default BasicCardNode; 