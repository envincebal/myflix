import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';
import { RegistrationView } from '../registration-view/registration-view';
import { UpdateView } from '../update-view/update-view';

import Button from 'react-bootstrap/Button';

export class MainView extends Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      favorites: [],
      user: null,
      register: false
    };
  }

  componentDidMount = () => {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getMovies = (token) => {
    const endpoint = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/movies";
    axios.get(endpoint, {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then(response => {
        this.setState({
          movies: response.data,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  addToFavorites = (movieId) => {
    const endpoint = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/movies";
    axios.get(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(response => {
        let movies = response.data;

        movies.forEach(movie => {
          if (movie._id === movieId) {
            this.setState(prevState => ({
              favorites: prevState.favorites.concat(movie)
            }))
          }
        })
      })
      .catch(error => {
        console.log(error);
      });

  }

  onLoggedIn = (authData) => {
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    localStorage.setItem('password', authData.user.Password);
    localStorage.setItem('email', authData.user.Email);
    localStorage.setItem('birthdate', authData.user.BirthDate);
    console.log(authData);
  
    this.getMovies(authData.token);
  }

  onLogOut = () => {
    this.setState({
      user: null,
      register: null
    });

    localStorage.removeItem('token');
  }

  render() {
    const { movies, user, favorites } = this.state;

    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        <Router>
          <Container>
            <Link to="/">
              <Button onClick={this.onLogOut}>Log Out</Button>
            </Link>
            <Link to={"/profile"}>
              <Button variant="link">Profile</Button>
            </Link>
            <Row>

              <Route exact path="/" render={() => {
                if (!user) {
                  return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                }
                return movies.map(m => {
                  return (
                    <Col key={m._id} xs={12} sm={6} md={4}>
                      <MovieCard key={m._id} value={m._id} movie={m} addFavorites={movieId => this.addToFavorites(movieId)} />
                    </Col>
                  );
                })
              }
              } />

              <Route exact path="/register" render={() => {
                return <RegistrationView />
              }} />
              <Route exact path="/movies/:movieId" render={({ match }) => {
                return (
                  <MovieView movie={movies.find(m => m._id === match.params.movieId)} />
                )
              }
              } />
              <Route exact path="/genres/:name" render={({ match }) => {
                return (
                  <GenreView movie={movies.find(m => m.genre.name === match.params.name)} />
                )
              }} />
              <Route exact path="/directors/:name" render={({ match }) => {
                return (
                  <DirectorView movie={movies.find(m => m.director.name === match.params.name)} />
                )
              }} />

              <Route exact path="/profile" render={() => {
                return (
                  <ProfileView user={user} token={localStorage.getItem("token")} />
                )
              }} />
              <Route exact path="/update" render={() => {
                return (
                  <UpdateView />
                )
              }} />
            </Row>
          </Container>
        </Router>
      </div>
    );
  }
}

