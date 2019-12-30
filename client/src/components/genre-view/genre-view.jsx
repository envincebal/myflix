import React from 'react';
import Container from "react-bootstrap/Container";
import { connect } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";

import "./genre-view.scss";

 function GenreView (props){
  const { movies } = props;
  if (!movies || !movies.length) return null;

  const movie = movies.find(movie => movie.genre.name); 
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="genre-card">
            <div className="genre-view">
              <h2 className="genre-title">Genre Info</h2>
              <div className="genre-div">
                <span className="label">Genre: </span>
                <span className="value">{movie.genre.name}</span>
              </div>
              <div className="genre-description">
                <span className="label">Description: </span>
                <span className="value">{movie.genre.description}</span>
              </div>
            </div>
            <Link to={"/"}>
              <Button className="back-button">Back</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default connect(({movies}) => ({movies}))(GenreView)

GenreView.propTypes = {
  genre: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  })
};