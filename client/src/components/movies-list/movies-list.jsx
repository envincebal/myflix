import React from 'react';
import {connect} from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import {MovieCard} from '../movie-card/movie-card';

const mapStateToProps = state => {
  const {visibilityFilter, movies} = state;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = filteredMovies.filter(m => m.title.toLowerCase().includes(visibilityFilter));
  }

  return {movies: filteredMovies};
};

function MoviesList(props) {
  const {movies} = props;

  if (!movies) {
    return <div className="main-view"/>;
  }

  return <div className="movies-list">
    <VisibilityFilterInput />
    <Row>

      {movies.map(m => {
        return (
          <Col key={m._id} xs={12} sm={6} md={4}>
            <MovieCard
              key={m._id}
              value={m._id}
              movie={m}
              addFavorites={movieId => this.addToFavorites(movieId)}/>
          </Col>
        );
      })
    }   
    </Row>
  </div>
}

export default connect(mapStateToProps)(MoviesList);