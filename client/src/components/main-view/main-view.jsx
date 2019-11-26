import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';

export class MainView extends Component {
  constructor() {
    super();

    this.state = {
      movies: null,
      selectMovie: null,
      user: null,
      register: false
    };
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


  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }
  onRegister = () => {
    if(!this.state.register){
      this.setState({register: true});
    }else{
      this.setState({register: false});
    }
    
  }

  render() {
    const { movies, selectedMovie, user, register } = this.state;

    if (!user && !register) return <LoginView onClick={this.onRegister} onLoggedIn={user => this.onLoggedIn(user)} />
    if (register) return <RegistrationView  onClick={this.onRegister}  />
    if (!movies) return <div className="main-view" />;
    
    return (
      <div className="main-view">
        <Container>
          <Row>
            {selectedMovie ? (
              <MovieView movie={selectedMovie} previous={movie => this.onMovieClick(!movie)} />
            ) : (
                movies.map(movie => (
                  <Col key={movie._id} xs={12} sm={6} md={4}>
                  <MovieCard key={movie._id} movie={movie} click={movie => this.onMovieClick(movie)} />
                  </Col>
                ))
              )
            }
          </Row>
        </Container>

      </div>
    );
  }
}

