import React, { useState } from 'react';
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from 'axios';

import "./profile-view.scss";

export const ProfileView = (props) => {

  const deleteProfile = (e) => {
    e.preventDefault();
    const { user } = props;
    const userURL = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/users/" + user;

    axios.delete(userURL)
      .then(response => {
        const data = response.data;
        window.open("/", "_self");
        localStorage.clear();
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  }

  const { user, token } = props;
  return (
    <Jumbotron fluid className="profile-view">
      <Container>
        {console.log(localStorage.getItem("userData"))}
        <h1>Fluid jumbotron</h1>
        <p>
          This is a modified jumbotron that occupies the entire horizontal space of
          its parent.
      </p>
      </Container>
    </Jumbotron>
  );
}

