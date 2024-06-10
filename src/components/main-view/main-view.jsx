import React, { useState } from "react";
import { MovieCard } from "../movie-card/MovieCard"; // Adjust the path if necessary
import { MovieView } from "../movie-view/MovieView"; // Adjust the path if necessary

  export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      image: "https://m.media-amazon.com/images/I/51IURF-sM-L._AC_SY679_.jpg",
      director: "Christopher Nolan",
    },
    {
      id: 2,
      title: "The Matrix",
      image: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_SY679_.jpg",
      director: "Lana Wachowski, Lilly Wachowski",
    },
    {
      id: 3,
      title: "Interstellar",
      image: "https://m.media-amazon.com/images/I/81kibO2GT0L._AC_SY679_.jpg",
      director: "Christopher Nolan",
    },
    {
      id: 4,
      title: "The Shawshank Redemption",
      image: "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_SY679_.jpg",
      director: "Frank Darabont",
    },
    {
      id: 5,
      title: "The Godfather",
      image: "https://m.media-amazon.com/images/I/51rOnIjLqzL._AC_SY679_.jpg",
      director: "Francis Ford Coppola",
    },
  ]);

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