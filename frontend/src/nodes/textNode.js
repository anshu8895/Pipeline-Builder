// textNode.js

import { useState, useEffect, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [textAreaHeight, setTextAreaHeight] = useState('auto');
  const [nodeWidth, setNodeWidth] = useState(240);
  const textAreaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [isTypingVariable, setIsTypingVariable] = useState(false);
  
  // Extract variables from text using regex and update handles with animation
  useEffect(() => {
    const regex = /\{\{([^{}]+)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const extractedVars = matches.map(match => match[1].trim());
    
    // Remove duplicates
    const uniqueVars = [...new Set(extractedVars)];
    
    // Only update state if variables have changed
    if (JSON.stringify(uniqueVars) !== JSON.stringify(variables)) {
      // Track if we're adding a new variable to trigger animation
      const addingNewVariable = uniqueVars.length > variables.length;
      
      setVariables(uniqueVars);
      
      // Add a subtle animation effect when a new variable is detected
      if (addingNewVariable && textAreaRef.current) {
        textAreaRef.current.classList.add('variable-added');
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.classList.remove('variable-added');
          }
        }, 1000);
      }
    }
    
    // Detect if user is currently typing a variable
    if (textAreaRef.current && cursorPosition !== null) {
      const textBeforeCursor = currText.substring(0, cursorPosition);
      const openBraces = (textBeforeCursor.match(/\{\{/g) || []).length;
      const closeBraces = (textBeforeCursor.match(/\}\}/g) || []).length;
      
      // If there are more open braces than close braces, user is typing a variable
      setIsTypingVariable(openBraces > closeBraces);
    }
  }, [currText, variables, cursorPosition]);
  
  // Track cursor position for variable typing detection
  const handleSelectionChange = () => {
    if (textAreaRef.current) {
      setCursorPosition(textAreaRef.current.selectionStart);
    }
  };
  
  // Enhanced auto-resize text area with smooth transitions
  useEffect(() => {
    if (textAreaRef.current) {
      // Reset height to auto to correctly calculate scroll height
      textAreaRef.current.style.height = 'auto';
      
      // Set height based on scroll height with minimum height
      const scrollHeight = Math.max(textAreaRef.current.scrollHeight, 60);
      setTextAreaHeight(`${scrollHeight}px`);
      
      // Calculate width based on content with better algorithm
      const lines = currText.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      const contentWidth = Math.max(
        240, // Minimum width
        Math.min(
          480, // Maximum width
          // Better character width approximation based on content length
          maxLineLength * 8 + 60 // Approx char width + padding
        )
      );
      
      // Only update width if it's significantly different to avoid jitter
      if (Math.abs(contentWidth - nodeWidth) > 20) {
        setNodeWidth(contentWidth);
      }
      
      // Apply variable highlighting
      const hasVariables = /\{\{[^{}]+\}\}/g.test(currText);
      if (textAreaRef.current) {
        textAreaRef.current.classList.toggle('has-variables', hasVariables);
        
        // Add class for variable typing detection
        textAreaRef.current.classList.toggle('typing-variable', isTypingVariable);
      }
    }
  }, [currText, nodeWidth, isTypingVariable]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    handleSelectionChange();
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    handleSelectionChange();
    // Add event listener for selection changes
    document.addEventListener('selectionchange', handleSelectionChange);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    // Remove event listener when blurring
    document.removeEventListener('selectionchange', handleSelectionChange);
  };
  
  // Add keyboard shortcut handling
  const handleKeyDown = (e) => {
    // Tab key adds two spaces without losing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newText = currText.substring(0, start) + '  ' + currText.substring(end);
      setCurrText(newText);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + 2;
          textAreaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    
    // Create variable brackets shortcut: Ctrl+B or Cmd+B
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const selectedText = currText.substring(start, end);
      
      // If text is selected, wrap it in variable brackets
      if (start !== end) {
        const newText = currText.substring(0, start) + '{{' + selectedText + '}}' + currText.substring(end);
        setCurrText(newText);
        // Place cursor after the closing brackets
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.selectionStart = end + 4;
            textAreaRef.current.selectionEnd = end + 4;
          }
        }, 0);
      } else {
        // If no text is selected, insert empty variable brackets and place cursor between them
        const newText = currText.substring(0, start) + '{{}}' + currText.substring(end);
        setCurrText(newText);
        // Place cursor between the brackets
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.selectionStart = start + 2;
            textAreaRef.current.selectionEnd = start + 2;
          }
        }, 0);
      }
    }
  };
  
  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Generate enhanced input handles for variables
  const inputHandles = variables.map(variable => ({
    id: `${id}-var-${variable}`,
    label: variable,
    position: Position.Left,
    style: { 
      backgroundColor: isFocused ? 'var(--color-accent-light)' : 'white',
      transform: isTypingVariable ? 'scale(1.1)' : 'scale(1)'
    }
  }));
  
  const content = (
    <div className="text-node-content">
      <label>
        Text:
        <div className={`textarea-container ${isFocused ? 'focused' : ''} ${isTypingVariable ? 'typing-variable' : ''}`}>
          <textarea 
            ref={textAreaRef}
            value={currText} 
            onChange={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyUp={handleSelectionChange}
            onKeyDown={handleKeyDown}
            onClick={handleSelectionChange}
            style={{ 
              height: textAreaHeight,
              resize: 'none',
              overflowY: 'hidden'
            }}
            placeholder="Type text here... Use {{variable}} for dynamic content"
            spellCheck="false"
          />
        </div>
      </label>
      
      {variables.length > 0 && (
        <div className="variable-list">
          <div className="variable-list-header">
            <small>Dynamic Variables:</small>
            <small className="variable-count">{variables.length}</small>
          </div>
          <div className="variable-chips">
            {variables.map(variable => (
              <span 
                key={variable} 
                className="variable-item" 
                title={`Connected to ${variable} input handle`}
                onClick={() => {
                  // Highlight this variable in the textarea by placing cursor inside it
                  if (textAreaRef.current) {
                    const varPattern = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
                    const match = varPattern.exec(currText);
                    if (match) {
                      const start = match.index + 2; // position after {{
                      const end = start + variable.length;
                      textAreaRef.current.focus();
                      textAreaRef.current.setSelectionRange(start, end);
                    }
                  }
                }}
              >
                {variable}
              </span>
            ))}
          </div>
          <div className="variable-help-container">
            <small className="variable-help">
              Variables automatically create input handles on the left side
            </small>
            <small className="keyboard-shortcut-info">
              Pro tip: Use Ctrl+B to insert variable brackets
            </small>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <BaseNode
      title="Text"
      inputs={inputHandles}
      outputs={[{ id: `${id}-output` }]}
      content={content}
      data={data}
      type="text"
      style={{ width: nodeWidth }}
      className={`auto-resizing-node ${isTypingVariable ? 'variable-editing' : ''}`}
    />
  );
}
