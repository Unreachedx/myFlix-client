import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


 export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
  const defaultImage = "https://via.placeholder.com/200"; // Use a placeholder image
  const directorName = movie.director && movie.director.name ? movie.director.name : "Unknown Director";
  const [favorite, setFavorite] = useState(isFavorite); // Initialize favorite state with isFavorite prop

  const handleToggleFavorite = () => {
    setFavorite(!favorite); // Toggle the favorite state locally
    onToggleFavorite(movie.id); // Pass the movie ID to the parent component (ProfileView)
  };

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
          textAlign: 'center',
          textDecoration: 'none' // Added to remove underline from Link
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
      <button onClick={handleToggleFavorite}>
        {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
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
  }),
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired // Add isFavorite prop validation
};

export default MovieCard