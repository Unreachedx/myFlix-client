import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Container, Row, Col, Button } from "react-bootstrap";


export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("token");
  const [token, setToken] = useState(authToken || null);

  useEffect(() => {
    if (!token) return;

    const fetchMovies = async () => {
      try {
        const response = await fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/movies", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();

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
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
      }
    };

    fetchMovies();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <>
        <LoginView
          onLoggedIn={(user, token) => {
            setUser(user);
            localStorage.setItem("token", token);
            setToken(token);
          }}
        />
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
    <Container>
      <Row>
        {movies.map((movie) => (
          <Col xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard
              movie={movie}
              onMovieClick={(newSelectedMovie) => {
                console.log("Movie clicked:", newSelectedMovie);
                setSelectedMovie(newSelectedMovie);
              }}
            />
          </Col>
        ))}
      <div className="d-flex justify-content-center mt-3">
        <Button className="w-auto" onClick={handleLogout}>Logout</Button>
      </div>
      </Row>
    </Container>
  );
};
