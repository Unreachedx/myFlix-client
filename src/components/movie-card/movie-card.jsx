import React from "react";

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