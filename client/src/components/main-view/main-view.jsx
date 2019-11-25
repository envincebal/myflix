import React, { Component } from 'react';
import axios from 'axios';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends Component {
  constructor() {
    super();

    this.state = {
      movies: null,
      selectMovie: null
    };
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  componentDidMount() {
    const endpoint = "https://shielded-anchorage-97078.herokuapp.com/movies";
    axios.get(endpoint)
      .then(res => {
        console.log(res.data[0]);
        this.setState({ movies: res.data })
      })
      .catch(err => console.log(err));
  }

  render() {
    const { movies, selectedMovie } = this.state;

    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView movie={selectedMovie} previous={movie => this.onMovieClick(!movie)}  />
        ) : (
            movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} click={movie => this.onMovieClick(movie)}  />
            ))
          )
        }
      </div>
    );
  }
}

