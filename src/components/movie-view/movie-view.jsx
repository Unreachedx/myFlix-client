import React from "react";

import { Container, Row, Col, Button, Card, CardGroup } from "react-bootstrap";

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/200";

export const MovieView = ({ movie, onBackClick }) => {
  // Determine the image source
  const imageUrl = movie.imagePath || placeholderImage;

  return (
    <div>
      <div>
        <img
          src={imageUrl}
          alt={movie.title}
          style={{ maxWidth: '100%', maxHeight: '400px', display: 'block', margin: '0 auto' }}
          onError={(e) => {
            e.target.src = placeholderImage; // Replace with placeholder image on error
          }}
        />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director.name}</span>
      </div>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
