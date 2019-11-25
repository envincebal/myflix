import React, {Component} from 'react';

export class MovieCard extends Component {
  render() {
    const { movie, click } = this.props;

    return (
      <div onClick={() => click(movie)} className="movie-card">{movie.title}</div>
    );
  }
}

