import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from 'axios';

export const UpdateView = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthDate] = useState("");

  const updateUserInfo = (e) => {
    e.preventDefault();

    const userURL = "https://cors-anywhere.herokuapp.com/https://shielded-anchorage-97078.herokuapp.com/users/";

    axios.put(userURL + localStorage.getItem('user'), {
      Username: username,
      Password: password,
      Email: email,
      BirthDate: birthdate
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        const data = response.data;
       
        localStorage.setItem("user", data.Username);
        localStorage.setItem("password", data.Password);
        localStorage.setItem("email", data.Email);
        localStorage.setItem("birthdate", data.BirthDate);
        console.log(data);
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  }

  return(
    <Container className="registrationForm">
      <Form>
        {console.log(getUser())}

        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" value={birthdate} onChange={e => setBirthDate(e.target.value)} />
        </Form.Group>
        <Button onClick={updateUserInfo}>Update Info</Button>

      </Form>
    </Container>
  )
}