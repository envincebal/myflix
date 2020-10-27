import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from 'axios';
import { Link } from "react-router-dom";

import "./registration-view.scss";

export const RegistrationView = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthDate] = useState("");
  let usernameError = false;
  let passwordError = false;
  let emailError = false;
  let birthdateError = false;

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const loginUrl = "https://protected-chamber-62597.herokuapp.com/users";
    axios.post(loginUrl, {
      Username: username,
      Password: password,
      Email: email,
      BirthDate: birthdate
    })
      .then(response => {
        const data = response.data;
        window.open("/client", "_self"); // the second argument '_self' is necessary so that the page will open in the current tab
      })
      .catch((err) => {
        username.length < 5 ? usernameError = true : !usernameError;
        password.length < 8 ? passwordError = true : !passwordError;
        !email.includes("@") || !email.includes(".com") ? emailError = true : !emailError;

        console.log(err);
      });
  }

  return (
    <Container className="registrationForm">
      <Form>
        {console.log(usernameError)}
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          {
            usernameError ? (
            <Form.Text className="password">  
            Username must be at least 5 characters long.
          </Form.Text>
            ):(
              ""
            )
          }
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {
            passwordError ? (
            <Form.Text className="password">  
            Password must be at least 8 characters long.
          </Form.Text>
            ):(
              ""
            )
          }
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          {
            emailError ? (
            <Form.Text className="password">
            Must be a valid email.
          </Form.Text>
            ):(
              ""
            ) 
          }
        </Form.Group>
        <Form.Group controlId="formBasicDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" value={birthdate} onChange={e => setBirthDate(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Register
        </Button> 
        <Form.Text className="text-muted">
          Already have an account? Log in <Link to={"/"}>HERE</Link>
        </Form.Text>
      </Form>
    </Container>
  )
}

