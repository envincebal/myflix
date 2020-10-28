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
  const [ error, setError ] = useState("");

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
        setError(err);
        console.log(err);
      });
  }

  return (
    <Container className="registrationForm">
      <Form>
        {console.log(typeof birthdate)}
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <Form.Text className="text-muted">
          Username must be at least 5 characters long.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Form.Text className="text-muted">
          Password must be at least 8 characters long.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
          Enter a valid email address.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" value={birthdate} onChange={e => setBirthDate(e.target.value)} />
        </Form.Group>
        {
          error && (
            <Form.Text className="login-error">
              An error occurred. One or more entries are invalid. Please try again.
            </Form.Text>
          )
        }
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

