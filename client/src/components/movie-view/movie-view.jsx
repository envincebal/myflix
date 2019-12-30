import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";

import "./movie-view.scss"

 function MovieView (props){

  const { movies, movieId } = props;

  if (!movies || !movies.length) return null;

  const movie = movies.find(movie => movie._id === movieId);


    return (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="movie-view-card">
              <div className="movie-view">
                <img className="movie-poster" style={{ textAlign: "center" }} src={movie.image} />
                <div className="movie-title">
                  <span className="label">Title: </span>
                  <span className="value">{movie.title}</span>
                </div>
                <div className="movie-description">
                  <span className="label">Description: </span>
                  <span className="value">{movie.description}</span>
                </div>

                <div className="movie-genre">
                  <span className="label">Genre: </span>
                  <span className="value">{movie.genre.name}</span>
                </div>
                <div className="movie-director">
                  <span className="label">Director: </span>
                  <span className="value">{movie.director.name}</span>
                </div>
                <div className="buttons-container">
                  <Link to={"/"}>
                    <Button variant="primary" className="back-button">
                    Back</Button>
                  </Link>
                  <Link to={"/genres/" + movie.genre.name}>
                    <Button variant="link">Genre</Button>
                  </Link>
                  <Link to={"/directors/" + movie.director.name}>
                    <Button variant="link">Director</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
}

export default connect(({ movies }) => ({ movies }))(MovieView);