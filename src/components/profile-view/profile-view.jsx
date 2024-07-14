import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from './../movie-card/movie-card';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

export const ProfileView = ({ username, token, movies, setUser }) => {
  const [user, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    dob: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        setLocalUser(userData);
        setFormData({
          username: userData.Username,
          password: '',
          email: userData.Email,
          dob: userData.Birthday
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, token]);

  const handleToggleFavorite = async (movieId) => {
    try {
      const isFavorite = user.FavoriteMovies.includes(movieId);
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}/favorites/${movieId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to update favorite movies');
      }
      const updatedFavorites = isFavorite
        ? user.FavoriteMovies.filter(id => id !== movieId)
        : [...user.FavoriteMovies, movieId];
      const updatedUser = { ...user, FavoriteMovies: updatedFavorites };
      setLocalUser(updatedUser);
      setUser(updatedUser); // Update global user state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Ensure localStorage is updated as well
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Username: formData.username,
          Password: formData.password,
          Email: formData.email,
          Birthday: formData.dob
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setLocalUser(updatedUser);
      setUser(updatedUser); // Update global user state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Ensure localStorage is updated as well
      navigate('/profile'); // Navigate to the profile view
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      localStorage.clear();
      setUser(null);
      navigate('/');
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Account Information</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Update</Button>
      </Form>
      <Button variant="danger" onClick={handleDelete} className="mt-3">Delete Profile</Button>

      <h3>Favorite Movies</h3>
      <Row>
        {user.FavoriteMovies.length === 0 ? (
          <Col>No favorite movies</Col>
        ) : (
          user.FavoriteMovies.map((movieId) => {
            const movie = movies.find((m) => m.id === movieId);
            if (movie) {
              return (
                <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card style={{ height: '100%' }}>
                    <Card.Body>
                      <MovieCard
                        movie={movie}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={user.FavoriteMovies.includes(movie.id)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              );
            }
            return null;
          })
        )}
      </Row>
    </Container>
  );
};
