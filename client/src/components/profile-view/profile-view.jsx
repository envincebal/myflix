import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from 'axios';
import { Link } from "react-router-dom";

import "./profile-view.scss";

export const ProfileView = (props) => {

  const deleteProfile = (e) => {
    e.preventDefault();
    const { user } = props;
    const userURL = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/users/Vincent";

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

      <Container className="profile-view">
        {console.log(localStorage)}
        <h4>Username</h4>
        <p>{localStorage.getItem("user")}</p>
        <h4>Email</h4>
        <p>{localStorage.getItem("email")}</p>
        <h4>Birth Date</h4>
        <p>{localStorage.getItem("birthdate").substr(0, 10)}</p>

        <Button onClick={deleteProfile}>Delete</Button>
        <Link to={"/update"}>
<Button >Update</Button>
        </Link>
        
      </Container>

  );
}

