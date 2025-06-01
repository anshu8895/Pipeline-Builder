// llmNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-3.5-turbo');
  
  const handleModelChange = (e) => {
    setModel(e.target.value);
  };
  
  const content = (
    <div>
      <label>
        Model:
        <select value={model} onChange={handleModelChange}>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="claude-2">Claude 2</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </label>
      <div className="input-labels">
        <div>Input Connections:</div>
        <small>• Top: System prompt</small>
        <small>• Bottom: User prompt</small>
      </div>
    </div>
  );

  return (
    <BaseNode
      title="LLM"
      inputs={[
        { id: `${id}-system` }, 
        { id: `${id}-prompt` }
      ]}
      outputs={[{ id: `${id}-response` }]}
      content={content}
      data={data}
      type="llm"
    />
  );
}
