import React from 'react';
import './progressBar.css';

const ProgressBar = ({ value, max }) => {
    const progress = (value / max) * 100;
    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
            </div>
        </div>
    );
};

export default ProgressBar;
