// BaseNode.js
// Reusable node abstraction component that dynamically renders node structure

import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

/**
 * BaseNode - A reusable component for building node types
 * @param {Object} props
 * @param {string} props.title - The title/label of the node
 * @param {Array} [props.inputs] - Array of input handle configurations [{id, label, position, style}]
 * @param {Array} [props.outputs] - Array of output handle configurations [{id, label, position, style}]
 * @param {React.ReactNode} [props.content] - Custom content to render inside the node
 * @param {Object} [props.data] - Data passed from the node definition
 * @param {Object} [props.style] - Custom styles for the node container
 * @param {string} [props.className] - Custom class name for the node container
 * @param {string} [props.type] - Node type (customInput, llm, etc) for styling
 */
export const BaseNode = ({ 
  title, 
  inputs = [], 
  outputs = [], 
  content = null, 
  data = {}, 
  style = {},
  className = '',
  type = '',
  id
}) => {
  // Get node type for styling, derived from data or passed directly
  const nodeType = type || data.nodeType || '';
  const deleteNode = useStore(state => state.deleteNode);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  
  // Calculate positions for multiple inputs/outputs
  const getHandlePosition = (index, total) => {
    // If only one handle, place it in the middle
    if (total === 1) return 50;
    
    // If multiple handles, distribute evenly
    // We want to avoid placing handles at the very top or bottom
    const segmentSize = 100 / (total + 1);
    return segmentSize * (index + 1);
  };
    const handleDelete = (e) => {
    e.stopPropagation();
    // Use id from props or from data
    const nodeId = id || data.id;
    deleteNode(nodeId);
  };
  return (
    <div 
      className={`node-container node-${nodeType} ${className}`}
      style={style}
    >
      {/* Input Handles - positioned on left side */}      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={input.position || Position.Left}
          id={input.id}
          data-tooltip={input.label || ''}
          title={input.label || ''}
          className={input.id.includes('-var-') ? 'variable-handle' : ''}
          style={{
            top: `${getHandlePosition(index, inputs.length)}%`,
            ...(input.style || {})
          }}
        />
      ))}      {/* Node Header */}
      <div className="node-header"
           onMouseEnter={() => setShowDeleteButton(true)}
           onMouseLeave={() => setShowDeleteButton(false)}>
        <div>{title}</div>        {showDeleteButton && (
          <div 
            className="delete-button" 
            onClick={handleDelete}
            title="Delete node">
            ✕
          </div>
        )}
      </div>

      {/* Node Content */}
      <div className="node-content">
        {content}
      </div>

      {/* Output Handles - positioned on right side */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={output.position || Position.Right}
          id={output.id}
          style={{
            top: `${getHandlePosition(index, outputs.length)}%`,
            ...(output.style || {})
          }}
        />
      ))}
    </div>
  );
};