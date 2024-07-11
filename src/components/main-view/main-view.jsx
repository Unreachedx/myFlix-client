import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar.jsx/navigation-bar";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("token");
  const [token, setToken] = useState(authToken || null);

  useEffect(() => {
    if (!token) return;

    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/movies",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
      <Container>
        <Row className="justify-content-md-center">
          <Col md={5}>
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user);
                localStorage.setItem("token", token);
                setToken(token);
              }}
            />
          </Col>
          <Col md={5}>
            <SignupView />
          </Col>
        </Row>
      </Container>
    );
  }

  console.log("Rendering MainView with movies:", movies);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={handleLogout}
      />
      <Container>
        <Row className="justify-content-md-center">
          <Routes>
            <Route
              path="/signup"
              element={
                <>
                  {user ? (
                    <Navigate to="/" />
                  ) : (
                    <Col md={5}>
                      <SignupView />
                    </Col>
                  )}
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  {user ? (
                    <Navigate to="/" />
                  ) : (
                    <Col md={5}>
                      <LoginView onLoggedIn={(user, token) => setUser(user)} />
                    </Col>
                  )}
                </>
              }
            />
            <Route
              path="/movie/:movieId"
              element={
                <MovieDetailsWrapper movies={movies} user={user} />
              }
            />
            <Route
              path="/"
              element={
                <>
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <Row>
                      {movies.map((movie) => (
                        <Col className="mb-4" key={movie.id} md={3}>
                          <MovieCard movie={movie} />
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              }
            />
          </Routes>
        </Row>
      </Container>
    </BrowserRouter>
  );
};

const MovieDetailsWrapper = ({ movies, user }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m.id === movieId);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!movie) {
    return <div>Movie not found!</div>;
  }

  return <MovieView movie={movie} />;
};