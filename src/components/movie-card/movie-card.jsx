import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
  const defaultImage = "https://via.placeholder.com/200"; // Use a placeholder image
  const directorName = movie.director && movie.director.name ? movie.director.name : "Unknown Director";
  const [favorite, setFavorite] = useState(isFavorite); // Initialize favorite state with isFavorite prop

  // Sync local favorite state with isFavorite prop
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggleFavorite = () => {
    const newFavoriteState = !favorite; // Toggle the favorite state locally
    setFavorite(newFavoriteState);
    onToggleFavorite(movie.id, newFavoriteState); // Pass the movie ID and new favorite state to the parent component (MainView)
  };

  return (
    <div className="movie-card">
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault(); // Prevent the default link behavior
        }}
        style={{
          position: "relative",
          display: "block",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          cursor: "pointer",
          textAlign: "center",
          textDecoration: "none", // Added to remove underline from Link
          height: "100%",
        }}
      >
        <img
          src={movie.imagePath || defaultImage}
          alt={movie.title}
          style={{ width: "100%" }}
          onError={(e) => {
            e.target.src = defaultImage; // Set default image on error
          }}
        />
        <h3>{movie.title}</h3>
        <p>Directed by {directorName}</p>
        <Button
          className="favorite-btn"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleToggleFavorite}
        >
          <FontAwesomeIcon
            icon={faHeart}
            style={{ color: favorite ? "red" : "black" }}
          />
        </Button>
      </Link>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imagePath: PropTypes.string,
    director: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired, // Add isFavorite prop validation
};