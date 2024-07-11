import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MovieView } from "../movie-view/movie-view";

export const MovieCard = ({ movie }) => {
  const defaultImage = "https://via.placeholder.com/200"; // Use a placeholder image
  const directorName = movie.director && movie.director.name ? movie.director.name : "Unknown Director";

  return (
    <div>
      <Link 
        to={`/movie/${encodeURIComponent(movie.id)}`}
        style={{
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '10px',
          cursor: 'pointer',
          width: '200px',
          textAlign: 'center'
        }}
      >
        <img 
          src={movie.imagePath || defaultImage}
          alt={movie.title} 
          style={{ width: '100%' }} 
          onError={(e) => {
            e.target.src = defaultImage; // Set default image on error
          }}
        />
        <h3>{movie.title}</h3>
        <p>Directed by {directorName}</p>
      </Link>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imagePath: PropTypes.string,
    director: PropTypes.shape({
      name: PropTypes.string
    }),
  })
};