import { Link } from "react-router-dom";
import React from "react";

import { Container, Row, Col, Button, Card, CardGroup } from "react-bootstrap";

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/200";

export const MovieView = ({ movie }) => {
  if (!movie) {
    return <div>Loading...</div>;
  }

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
        <span style={{ fontWeight: 'bold' }}>Title:</span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}>Director:</span>
        <span>{movie.director.name}</span>
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}>Description:</span>
        <span>{movie.description}</span>
      </div>
      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};