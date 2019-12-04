import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

import "./movie-card.scss";

export class MovieCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    }
  }

  addFavorites = () => {
    console.log(this.props)
    this.props.addFavorites(this.props.value);
    this.setState({
      clicked: true
    })
  }

  render() {
    const { movie } = this.props;

    return (
      <Card className="mb-3 mb-sm-4" style={{ width: '16rem' }}>
        <Card.Img variant="top" src={movie.image} />
        <Card.Body>

          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>{movie.description}</Card.Text>
          <Link to={"/movies/" + movie._id}>
            <Button variant="link">Open</Button>
          </Link>
          {!this.state.clicked ? (
            <Button variant="link" onClick={this.addFavorites}>Add to Favorites</Button>
          ) : (
              <p className="added">Added to Favorites</p>
            )

          }
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string
    }),
    director: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      birth: PropTypes.string
    }),
    featured: PropTypes.bool
  }).isRequired
};