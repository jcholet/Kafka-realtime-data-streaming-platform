import React from 'react';
import './progressBar.css';

const ProgressBar = ({ value, max, segmentNumber }) => {
    // Taille de chaque segment en pourcentage
    const segmentSize = 100 / segmentNumber;

    // Calculer la progression totale en pourcentage en fonction de max
    const normalizedValue = (value / max) * 100;

    // Générer un tableau de segments basé sur segmentNumber
    const segments = Array.from({ length: segmentNumber }, (_, i) => {
        // Calculer la progression pour chaque segment
        const start = i * segmentSize;
        const end = (i + 1) * segmentSize;
        const segmentProgress = Math.min(Math.max(normalizedValue - start, 0), segmentSize);

        return (
            <div key={i} className="progress-bar-segment">
                <div
                    className="progress-bar-filled"
                    style={{ width: `${(segmentProgress / segmentSize) * 100}%` }}
                ></div>
            </div>
        );
    });

    return <div className="progress-bar-container">{segments}</div>;
};

export default ProgressBar;