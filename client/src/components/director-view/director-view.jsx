import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./director-view.scss";

function DirectorView(props){
  const { movies } = props;
  if (!movies || !movies.length) return null;

  const movie = movies.find(movie => movie.director.name);

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <div className="movie-director">
            <div className="genre-title">
              <span className="label">Name: </span>
              <span className="value">{movie.director.name}</span>
            </div>
            <div className="movie-description">
              <span className="label">Biography: </span>
              <span className="value">{movie.director.Bio}</span>
            </div>
            <div className="movie-genre">
              <span className="label">BirthDate: </span>
              <span className="value">{movie.director.birth}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default connect(({movies}) => ({movies}))(DirectorView);

DirectorView.propTypes = {
  director: PropTypes.shape({
    name: PropTypes.string,
    Bio: PropTypes.string
  }).isRequired
};