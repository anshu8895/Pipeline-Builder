// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="pipeline-toolbar">
            <div className="toolbar-nodes">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='math' label='Math' />
                <DraggableNode type='api' label='API' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='delay' label='Delay' />
            </div>
        </div>
    );
};
