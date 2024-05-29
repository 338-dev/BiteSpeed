import React from 'react';
import './NodesPanel.css';

const NodesPanel = () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="nodes-panel">
            <div
                className="dndnode"
                onDragStart={(event) => onDragStart(event, 'customNode')}
                draggable
            >
                Message
            </div>
        </div>
    );
};

export default NodesPanel;
