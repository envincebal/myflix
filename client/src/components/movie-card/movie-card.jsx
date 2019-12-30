import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Link} from "react-router-dom";
import axios from 'axios';

import "./movie-card.scss";

export const MovieCard = (props) => {
  const [favArray, setFav] = useState([]);

  const {movie} = props;

  const addFavorites = (e) => {
    e.preventDefault();
    const url = `https://shielded-anchorage-97078.herokuapp.com/users/`;
    const user = localStorage.getItem("user");
    const addMovie = `${url}${user}/Movies/${movie._id}`;

    let favArr = localStorage.getItem("favorites");
    let favorites = favArr ? JSON.parse(favArr) : [];

    axios.post(addMovie, {
      Username: user
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      console.log(response);
    }).catch(event => {
      console.log('error adding movie to list');
    });

    favorites.push(movie._id);

    setFav([...favArray, movie._id])

    localStorage.setItem('favorites', JSON.stringify(favorites));

  }

  return (
    <Card className="mb-3 mb-sm-4 movie-card" style={{
      width: '16rem'
    }}>
      <Card.Img variant="top" src={movie.image}/>
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Link to={"/movies/" + movie._id}>
          <Button variant="link">Open</Button>
        </Link>
        {!localStorage.getItem("favorites").includes(movie._id)
          ? (
            <Button variant="link" value={movie.title} onClick={addFavorites}>Add to Favorites</Button>
          )
          : (
            <p className="added">Added to Favorites</p>
          )
        }
      </Card.Body>
    </Card>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
};