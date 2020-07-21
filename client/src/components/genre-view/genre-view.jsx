import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'; 
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom"; 
import "./genre-view.scss";

export const GenreView = (props) => {
  const { movie } = props;
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
            <Link to={"/"}>
              <Button className="back-button">Back</Button>
            </Link> 
          </div>
        </Card>
      </Col>
    </Row>
  </Container>
  );
}