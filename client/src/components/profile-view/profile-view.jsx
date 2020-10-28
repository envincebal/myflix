import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import axios from 'axios';
import Card from 'react-bootstrap/Card'; 
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
    const userURL = "https://protected-chamber-62597.herokuapp.com/users/";
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
    const userURL = "https://protected-chamber-62597.herokuapp.com/users/" + user;

    axios.delete(userURL)
      .then(response => {
        const data = response.data;
        window.open("/client", "_self");
        console.log(data);
        localStorage.clear();
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  }

  deleteMovie = (e, movieId) => {
    e.preventDefault();

    const url = `https://protected-chamber-62597.herokuapp.com/users/`;
    const user = localStorage.getItem("user");
    const deleteMovie = `${url}${user}/Movies/${movieId}`;

    axios.delete(deleteMovie, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {

        this.getUser(localStorage.getItem("token"));
      })
      .catch(event => {
        console.log(event);
      });

      let favorites  = JSON.parse(localStorage.getItem("favorites"));

      favorites.splice(favorites.indexOf(movieId), 1)
      localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  render(){
    const {favoriteMovies, username, email, birthdate} = this.state;
    let movies = JSON.parse(localStorage.getItem("movies"));
    let filteredFavorites = [];

    movies.map(m => {
      favoriteMovies.forEach(favorite => {
        if (m._id === favorite) {
          filteredFavorites.push(m);
        }
      })
    });

    return (
      <div className="profile-view">
        <Card className="profile-card">
          <h2 className="profile-title">Profile Info</h2>
          <h4>Username</h4> 
          <p>{username}</p>
          <h4>Email</h4>
          <p>{email}</p> 
          <h4>Birth Date</h4>
          <p>{birthdate}</p>
          <h4>Favorite Movies</h4>
          <ul>
            {
              filteredFavorites.map(favorite => {
                return (
                  <li key={favorite._id} className="movie-item">{favorite.title} | 
                  <span className="delete-movie" onClick={(e) => this.deleteMovie(e, favorite._id)}> Delete</span>
                  </li>
                )
                }) 
              }
          </ul>
          <div className="buttons-container">
            <Link to={"/"}>
              <Button className="back-button">Back</Button>
            </Link>
            <Button 
              className="delete-button"
              onClick={this.deleteProfile}>
                Delete Profile
            </Button>
            <Link to={"/update"}>
              <Button
                className="update-button">
                Update Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

}
