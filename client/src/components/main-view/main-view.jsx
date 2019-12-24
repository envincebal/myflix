import React, {Component} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import {BrowserRouter as Router, Route} from "react-router-dom";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setMovies, setLoggedInUser} from "../../actions/actions";
import MoviesList from '../movies-list/movies-list';

import MovieView from '../movie-view/movie-view';
import {LoginView} from '../login-view/login-view';
import GenreView from '../genre-view/genre-view';
import DirectorView from '../director-view/director-view';
import {ProfileView} from '../profile-view/profile-view';
import {RegistrationView} from '../registration-view/registration-view';
import {UpdateView} from '../update-view/update-view';

export class MainView extends Component {
  constructor() {
    super();

    this.state = {
      user: null
    };
  }

  componentDidMount ()  {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  getUser (token)  {
    let username = localStorage.getItem('user');
    const userURL = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/users/";
    axios.get(userURL + username, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setLoggedInUser(response.data);
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

  getMovies (token)  {
    const endpoint = "https://shielded-anchorage-97078.herokuapp.com/movies";
    axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        this.props.setMovies(response.data);

        localStorage.setItem("movies", JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }

  onLoggedIn (authData)  {
    this.setState({user: authData.user.Username});

    const favorites = localStorage.getItem("favorites");

    if(favorites === null){
      localStorage.setItem('favorites', []);
    }
    this.props.setLoggedInUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);

    this.getMovies(authData.token);
  }

  onLogOut ()  {
    this.setState({user: null});

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  render() {
    const {user} = this.state;
    const {movies} = this.props;

    if (!movies) 
      return <div className="main-view"/>;
    
    return (
      <div className="main-view">

   
        <Router>
          <Container>
            <Link to="/">
              <Button onClick={() => this.onLogOut()}>Log Out</Button>
            </Link>
            <Link to={"/profile"}>
              <Button variant="link">Profile</Button>
            </Link>
            
              <Route
                exact
                path="/"
                render={() => {
                if (!user) {
                  return <LoginView onLoggedIn={user => this.onLoggedIn(user)}/>
                }
                return <MoviesList movies={movies} />
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
                return (<MovieView movieId={match.params.movieId}/>)
              }}/>
              <Route
                exact
                path="/genres/:name"
                render={({match}) => {
                return (<GenreView movie={match.params.name}/>)
              }}/>
              <Route
                exact
                path="/directors/:name"
                render={({match}) => {
                return (<DirectorView movie={match.params.name}/>)
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
            
          </Container>
        </Router>
      </div>
    );
  }
}
  let mapStateToProps = state => {
    return {
      movies: state.movies
    }
  }

  export default connect(mapStateToProps, {setMovies,setLoggedInUser})(MainView);