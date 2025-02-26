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
  Input,
  IconButton,
  HStack
} from '@chakra-ui/react';
import { PhoneIcon, EditIcon, DeleteIcon, ViewIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';

const handleStyle = {
  width: '10px',
  height: '10px',
  backgroundColor: '#4CD964',
  border: '1px solid #2D3748',
  borderRadius: '50%',
  cursor: 'crosshair',
  zIndex: 1
};

const EntityNode = ({ data, id }) => {
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

  const handleDuplicate = () => {
    const customEvent = new CustomEvent('node:duplicate', { 
      detail: { id, type: 'entity', data: localData } 
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
      p={2}
      bg="#23252f"
      borderRadius="md"
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
          <input type="hidden" name="sourceName" value={localData.sourceName || 'web'} />
          <Stack direction="row" className="css-1igwmid">
            <Stack direction="row" className="css-1igwmid">
              <Icon as={ViewIcon} className="css-lrvc3z" w={3} h={3} color="gray.400" />
              <Text className="css-uvtkss" fontSize="xs" color="gray.400">Work</Text>
            </Stack>
          </Stack>
          <Divider className="css-opvkbs" />
          <Box className="css-zgtese">
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
          </Box>
          <Divider className="css-opvkbs" />
          <Box className="css-zgtese">
            <Box className="css-hboir5">
              <Box 
                bg="#38A169" 
                h="4px" 
                w={`${localData.progress}%`} 
                borderRadius="full"
                mb={1}
              />
            </Box>
            <Stack direction="row" className="css-1igwmid">
              <HStack spacing={1}>
                <Input 
                  className="css-l0zmib nodrag" 
                  fontSize="xs" 
                  value={localData.issues}
                  onChange={(e) => updateField('issues', parseInt(e.target.value) || 0)}
                  width="20px"
                  border="none"
                  bg="transparent"
                  color="gray.400"
                  _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                  size="xs"
                />
                <Text className="css-l0zmib" fontSize="xs" color="gray.400">issues</Text>
              </HStack>
              <Box className="css-xsawf1" />
              <HStack spacing={1}>
                <Input 
                  className="css-l0zmib nodrag" 
                  fontSize="xs" 
                  value={localData.progress}
                  onChange={(e) => updateField('progress', parseInt(e.target.value) || 0)}
                  width="20px"
                  border="none"
                  bg="transparent"
                  color="gray.400"
                  _focus={{ boxShadow: 'none', borderBottom: '1px solid #718096' }}
                  size="xs"
                />
                <Text className="css-l0zmib" fontSize="xs" color="gray.400">% done</Text>
              </HStack>
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
                className={`css-6oc8dj nodrag ${localData.status === 'Done' ? 'css-done' : ''}`}
                value={localData.status}
                onChange={(e) => updateField('status', e.target.value)}
                border="none"
                bg={localData.status === 'In progress' ? '#F0B429' : localData.status === 'Done' ? '#38A169' : '#4A5568'}
                color="white"
                _focus={{ boxShadow: 'none' }}
                size="xs"
                fontSize="xs"
                width="60px"
                textAlign="center"
                borderRadius="sm"
                px={1}
              />
            </Stack>
          </Box>
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

export default EntityNode; 