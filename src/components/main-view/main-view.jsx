import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { NavigationBar } from "../navigation-bar.jsx/navigation-bar";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { ProfileView } from "../profile-view/profile-view";
import "../../index.scss"; // Import index.scss for global styling

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("token");
  const [token, setToken] = useState(authToken || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); // useLocation() hook

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
          if (response.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
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
          setFilteredMovies(moviesFromApi); // Initialize filteredMovies with all movies
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

  useEffect(() => {
    // Filter movies based on searchQuery
    if (searchQuery.trim() === "") {
      setFilteredMovies(movies); // Reset to all movies if search query is empty
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = movies.filter((movie) => {
        // Ensure movie.title, and movie.genre are strings
        const titleMatch = movie.title.toLowerCase().includes(lowercaseQuery);
        const genreMatch =
          typeof movie.genre === "string" && movie.genre.toLowerCase().includes(lowercaseQuery);
        return titleMatch || genreMatch;
      });
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const handleToggleFavorite = async (movieId, isFavorite) => {
    try {
      const method = isFavorite ? "POST" : "DELETE";
      const response = await fetch(
        `https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${user.Username}/favorites/${movieId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update favorite movies");
      }
      const updatedFavorites = isFavorite
        ? [...user.FavoriteMovies, movieId]
        : user.FavoriteMovies.filter((id) => id !== movieId);
      const updatedUser = { ...user, FavoriteMovies: updatedFavorites };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      setError(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const handleLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {!token ? (
        <Container>
          <Row className="justify-content-md-center">
            <Routes>
              <Route
                path="/login"
                element={<Col md={5}><LoginView onLoggedIn={handleLoggedIn} /></Col>}
              />
              <Route path="/signup" element={<Col md={5}><SignupView /></Col>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Row>
        </Container>
      ) : (
        <>
          <NavigationBar user={user} onLoggedOut={handleLogout} />
          <Container>
            <Row className="justify-content-md-center">
              <Form className={`mb-3 ${location.pathname === "/profile" ? "hide-search" : ""}`}>
                <Form.Group controlId="searchQuery">
                  <Form.Control
                    type="text"
                    placeholder="Search by title or genre"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </Form.Group>
              </Form>
              <Routes>
                <Route
                  path="/movie/:movieId"
                  element={<MovieDetailsWrapper movies={filteredMovies} user={user} />}
                />
                <Route
                  path="/profile"
                  element={
                    user ? (
                      <ProfileView
                        username={user.Username}
                        token={token}
                        movies={filteredMovies}
                        setUser={setUser}
                        onToggleFavorite={handleToggleFavorite} // Pass onToggleFavorite to ProfileView
                      />
                    ) : (
                      <Navigate to="/login" replace />
                    )
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
                          {filteredMovies.map((movie) => (
                            <Col className="mb-4" key={movie.id} md={3}>
                              <MovieCard
                                movie={movie}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={user.FavoriteMovies.includes(movie.id)}
                              />
                            </Col>
                          ))}
                        </Row>
                      )}
                    </>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Row>
          </Container>
        </>
      )}
    </>
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