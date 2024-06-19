import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card"; // Adjust the path if necessary
import { MovieView } from "../movie-view/movie-view"; // Adjust the path if necessary

  export const MainView = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/movies")
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.docs.map((doc) => {
          return {
            id: doc.key,
            title: doc.title,
            author: doc.author_name?.[0],
          };
        });

        setMovies(moviesFromApi);
      });
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(null);

  console.log("Rendering MainView with movies:", movies);
  console.log("Selected movie:", selectedMovie);

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            console.log("Movie clicked:", newSelectedMovie);
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};