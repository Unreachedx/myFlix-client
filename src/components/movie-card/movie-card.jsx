import React from "react";
import { PropTypes } from 'prop-types';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      onClick={() => {
        onMovieClick(movie);
      }}
      style={{
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        cursor: 'pointer',
        width: '200px',
        textAlign: 'center'
      }}
    >
      <img src={movie.image} alt={movie.title} style={{ width: '100%' }} />
      <h3>{movie.title}</h3>
      <p>Directed by {movie.director}</p>
    </div>
  );
};

// Here is where we define all the props constraints for the MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};