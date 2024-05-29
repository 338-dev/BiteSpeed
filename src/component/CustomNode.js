import React from 'react';
import { Handle } from 'reactflow';

const CustomNode = ({ data }) => {
    return (
        <div className="custom-node">
            <div className="custom-node-header">Send Message</div>
            <div style={{ marginLeft: '10px' }}>{data.label}</div>
            <Handle type="source" position="left" />
            <Handle type="target" position="right" />
        </div>
    );
};

export default CustomNode;
