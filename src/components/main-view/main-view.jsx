import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card"; // Adjust the path if necessary
import { MovieView } from "../movie-view/movie-view"; // Adjust the path if necessary
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          const moviesFromApi = data.map((movie) => ({
            id: movie._id,
            title: movie.title,
            imagePath: movie.imagePath,
            director: movie.director,
            genre: movie.genre,
            release_year: movie.release_year,
          }));
          setMovies(moviesFromApi);
        } else {
          throw new Error("Invalid data structure");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
      });
  }, [token]);

  if (!user) {
    return (
      <>
        <LoginView
          onLoggedIn={(user, token) => {
            setUser(user);
            setToken(token);
          }}
        />
        or
        <SignupView />
      </>
    );
  }

  console.log("Rendering MainView with movies:", movies);
  console.log("Selected movie:", selectedMovie);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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