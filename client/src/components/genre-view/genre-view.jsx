import React from 'react';
import Container from "react-bootstrap/Container";
import { connect } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import "./genre-view.scss";

 function GenreView (props){
  const { movies } = props;
  if (!movies || !movies.length) return null;

  const movie = movies.find(movie => movie.genre.name); 
  return (
    <Container>
      <Row>
        {console.log(movies)} 
        <Col md={{ span: 6, offset: 3 }}>
          <div className="genre-view">
            <div className="movie-title">
              <span className="label">Genre: </span>
              <span className="value">{movie.genre.name}</span>
            </div>
            <div className="movie-description">
              <span className="label">Description: </span>
              <span className="value">{movie.genre.description}</span>
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default connect(({movies}) => ({movies}))(GenreView)