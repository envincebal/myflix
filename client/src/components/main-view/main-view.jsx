import React, {Component } from "react";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import {BrowserRouter as Router, Route} from "react-router-dom";
import {Link} from "react-router-dom";

import {MovieCard} from "../movie-card/movie-card";
import {MovieView} from '../movie-view/movie-view';
import {LoginView} from '../login-view/login-view';
import {GenreView} from '../genre-view/genre-view';
import {DirectorView} from '../director-view/director-view';
import {ProfileView} from '../profile-view/profile-view';
import {RegistrationView} from '../registration-view/registration-view';
import {UpdateView} from '../update-view/update-view';

import "./main-view.scss";

export class MainView extends Component {
  
  constructor() {
    super();

    this.state = {
      movies: [],
      favoriteMovies: [],
      user: null,
      userData: null,
      input: ""
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user")
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  getUser = (token) => {
    let username = localStorage.getItem("user");
    const userURL = "https://protected-chamber-62597.herokuapp.com/users/";
    axios.get(userURL + username, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          username: response.data.Username,
          email: response.data.Email,
          birthdate: response.data.BirthDate.substr(0,10),
          favoriteMovies: response.data.favoriteMovies
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getMovies(token) {
    const endpoint = "https://protected-chamber-62597.herokuapp.com/movies";
    axios
      .get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        this.setState({movies: response.data});
        localStorage.setItem("movies", JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }

  onLoggedIn(authData) {
    this.setState({user: authData.user.Username});

    const favorites = localStorage.getItem("favorites");

    if(favorites === null){
      localStorage.setItem("favorites", []);
    }
    
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);

    this.getMovies(authData.token);
  }

  onLogOut() {
    this.setState({user: null});

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  onChangeHandler = (e) => {
    this.setState({
      input: e.target.value,
    })
  }

  render() { 
    const {movies, user, input} = this.state;

    if (!movies) 
      return <div className="main-view"/>;

    return (
      <div className="main-view">
        <Router basename="/client">
          <Navbar bg="dark" variant="dark">
            <Link to={"/"}>
              <Navbar.Brand className="main-title">MyFlix</Navbar.Brand>
            </Link>
            <Nav className="mr-auto">
            </Nav>
            {user && (
              <div>
                <Link to={"/profile"}>
                  <Button variant="link">Profile</Button>
                </Link>
                <Link to="/">
                  <Button onClick={() => this.onLogOut()}>Log Out</Button>
                </Link>
              </div>
            )}
          </Navbar> 
          <Container>
            <div className="main-container">  
              <Route
                exact
                path="/"
                render={() => {
                if (!user) {
                  return <LoginView onLoggedIn={user => this.onLoggedIn(user)}/>
                }
                return (
                  <div className="movies-list">
                    <input 
                      value={input} 
                      type="text"
                      placeholder="Filter movies" 
                      className="filter-form form-control"
                      onChange={this.onChangeHandler} 
                    />
                    <Row>
                    {
                    movies.filter(movie => input === "" || movie.title.toLowerCase().includes(input))
                    .map(m => { 
              
                    return (
                      <Col key={m._id} xs={12} sm={6} md={4}>
                        <MovieCard
                          key={m._id}
                          value={m._id}
                          movie={m}
                          addFavorites={movieId => this.addToFavorites(movieId)}
                        />
                      </Col>
                    );
                    })}
                    </Row>
                  </div>
                )
              }}/>
              <Route
                exact
                path="/register"
                render={() => {
                return <RegistrationView/>
              }}/>
              <Route
                exact
                path="/movies/:movieId"
                render={({match}) => {
                return (<MovieView movie={movies.find(m => m._id === match.params.movieId)}/>)
              }}/>
              <Route
                exact
                path="/genres/:name"
                render={({match}) => {
                return (<GenreView movie={movies.find(m => m.genre.name === match.params.name)}/>)
              }}/>
              <Route
                exact
                path="/directors/:name"
                render={({match}) => {
                return (<DirectorView movie={movies.find(m => m.director.name === match.params.name)}/>)
              }}/>

              <Route
                exact
                path="/profile"
                render={() => {
                return (<ProfileView />)
              }}/>
              <Route
                exact
                path="/update"
                render={() => {
                return (<UpdateView/>)
              }}/>
            </div>
          </Container>
        </Router>
      </div>
    );
  }
}
