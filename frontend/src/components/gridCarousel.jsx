import React, { useRef } from 'react';
import './gridCarousel.css';

const GridCarousel = ({ items }) => {
  const gridRef = useRef(null);

  // Fonction pour défiler vers la gauche
  const scrollLeft = () => {
    gridRef.current.scrollBy({
      left: -gridRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  // Fonction pour défiler vers la droite
  const scrollRight = () => {
    gridRef.current.scrollBy({
      left: gridRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className="carousel-container">
      <button className="carousel-button prev" onClick={scrollLeft}>‹</button>
      <div className="carousel-grid" ref={gridRef}>
        {/* Rendu des éléments de la grille */}
        {items.map((item, index) => (
          <div key={index} className="carousel-item">
            {item}
          </div>
        ))}
      </div>
      <button className="carousel-button next" onClick={scrollRight}>›</button>
    </div>
  );
};

export default GridCarousel;