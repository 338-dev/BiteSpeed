import React from 'react';
import './SettingsPanel.css';

const SettingsPanel = ({ selectedNode, onNodeTextChange }) => {
    return (
        <div className="settings-panel">
            {selectedNode && (
                <>
                    <h3>Settings</h3>
                    <label htmlFor="nodeText">Text:</label>
                    <input
                        id="nodeText"
                        type="text"
                        value={selectedNode.data.label}
                        onChange={(e) => onNodeTextChange(e.target.value)}
                    />
                </>
            )}
        </div>
    );
};

export default SettingsPanel;
