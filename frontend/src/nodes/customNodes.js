// customNodes.js
// Collection of sample nodes using the BaseNode abstraction

import { useState } from 'react';
import { BaseNode } from './BaseNode';

// Math Operation Node
export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'add');
  
  const handleOperationChange = (e) => {
    setOperation(e.target.value);
  };
  
  const content = (
    <div>
      <label>
        Operation:
        <select value={operation} onChange={handleOperationChange}>
          <option value="add">Addition</option>
          <option value="subtract">Subtraction</option>
          <option value="multiply">Multiplication</option>
          <option value="divide">Division</option>
        </select>
      </label>
    </div>
  );
  
  return (
    <BaseNode
      title="Math Operation"
      inputs={[
        { id: `${id}-number1` },
        { id: `${id}-number2` }
      ]}
      outputs={[
        { id: `${id}-result` }
      ]}
      content={content}
      data={data}
      type="math"
    />
  );
};

// API Node
export const ApiNode = ({ id, data }) => {
  const [endpoint, setEndpoint] = useState(data?.endpoint || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');
  
  const handleEndpointChange = (e) => {
    setEndpoint(e.target.value);
  };
  
  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };
  
  const content = (
    <div>
      <label>
        Endpoint:
        <input type="text" value={endpoint} onChange={handleEndpointChange} />
      </label>
      <label>
        Method:
        <select value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </div>
  );
  
  return (
    <BaseNode
      title="API Request"
      inputs={[
        { id: `${id}-request-body` },
        { id: `${id}-headers` }
      ]}
      outputs={[
        { id: `${id}-response` },
        { id: `${id}-error` }
      ]}
      content={content}
      data={data}
      type="api"
    />
  );
};

// Filter Node
export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'x > 0');
  
  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };
  
  const content = (
    <div>
      <label>
        Condition:
        <input type="text" value={condition} onChange={handleConditionChange} />
      </label>
      <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
        <div className="input-labels">True → Upper output</div>
        <div className="input-labels">False → Lower output</div>
      </div>
    </div>
  );
  
  return (
    <BaseNode
      title="Filter"
      inputs={[
        { id: `${id}-value` }
      ]}
      outputs={[
        { id: `${id}-true`, label: 'True' },
        { id: `${id}-false`, label: 'False' }
      ]}
      content={content}
      data={data}
      type="filter"
    />
  );
};

// Transform Node
export const TransformNode = ({ id, data }) => {
  const [transformation, setTransformation] = useState(data?.transformation || 'x => x.toUpperCase()');
  
  const handleTransformationChange = (e) => {
    setTransformation(e.target.value);
  };
  
  const content = (
    <div>
      <label>
        Transform:
        <textarea
          value={transformation}
          onChange={handleTransformationChange}
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </label>
    </div>
  );
  
  return (
    <BaseNode
      title="Transform"
      inputs={[
        { id: `${id}-input` }
      ]}
      outputs={[
        { id: `${id}-output` }
      ]}
      content={content}
      data={data}
      type="transform"
    />
  );
};

// Delay Node
export const DelayNode = ({ id, data }) => {
  const [delay, setDelay] = useState(data?.delay || 1000);
  
  const handleDelayChange = (e) => {
    setDelay(Number(e.target.value));
  };
  
const content = (
    <div>
        <label>
            Delay (ms):
            <input
                type="number"
                min="0"
                value={delay === 0 ? '' : delay}
                onChange={e => {
                    const val = e.target.value;
                    setDelay(val === '' ? 0 : Number(val.replace(/^0+/, '') || 0));
                }}
                inputMode="numeric"
                pattern="[0-9]*"
            />
        </label>
    </div>
);
  
  return (
    <BaseNode
      title="Delay"
      inputs={[
        { id: `${id}-input` }
      ]}
      outputs={[
        { id: `${id}-output` }
      ]}
      content={content}
      data={data}
      type="delay"
    />
  );
};