import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from 'axios';
import {Link} from "react-router-dom";

import "./profile-view.scss";

export class ProfileView extends Component {
  constructor(props){
    super(props);

    this.state = {
      favoriteMovies: [],
      username: null,
      email: null,
      birthdate: null
    }
  }

  componentDidMount = () => {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser = (token) => {
    let username = localStorage.getItem('user');
    const userURL = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/users/";
    axios.get(userURL + username, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {

        this.setState({
          username: response.data.Username,
          email: response.data.Email,
          birthdate: response.data.BirthDate.substr(0,10),
          favoriteMovies: response.data.FavoriteMovies
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  deleteProfile = (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    const userURL = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/users/" + user;

    axios.delete(userURL)
      .then(response => {
        const data = response.data;
        window.open("/", "_self");
        console.log(data);
        localStorage.clear();
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  }

  deleteMovie = (e, movieId) => {
    e.preventDefault();
    console.log(movieId);
    const url = `https://shielded-anchorage-97078.herokuapp.com/users/`;
    const user = localStorage.getItem("user");
    const deleteMovie = `${url}${user}/Movies/${movieId}`;
    axios.delete(deleteMovie, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        console.log(response);
        this.getUser(localStorage.getItem("token"));
      })
      .catch(event => {
        console.log(event);
      });

    let favorites  = JSON.parse(localStorage.getItem("favorites"))
    favorites.splice(favorites.indexOf(movieId), 1)
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  render(){
    const {favoriteMovies, username, email, birthdate} = this.state;
    
    return (
      <Container className="profile-view">
        <h4>Username</h4>
        <p>{username}</p>
        <h4>Email</h4>
        <p>{email}</p>
        <h4>Birth Date</h4>
        <p>{birthdate}</p>
        <h4>Favorite Movies</h4>
          <ul>
            {favoriteMovies && (
              favoriteMovies.map(favorite => {
                const moviesList = JSON.parse(localStorage.getItem("movies"));
                return (
                  <li key={favorite} className="movie-item" >{moviesList.find(movie => movie._id === favorite).title} | 
                  <span className="delete" onClick={(e) => this.deleteMovie(e, favorite)}>Delete</span>
                  </li>
                )
                })
              )}
          </ul>
        <Button onClick={this.deleteProfile}>Delete</Button>
        <Link to={"/update"}>
          <Button >Update</Button>
        </Link>
      </Container>
    );
  }

}
