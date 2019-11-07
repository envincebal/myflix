const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.static("public"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

//Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  let favoriteMovies = [{
    "2005": "V For Vendetta",
    "1980": "The Empire Strikes Back",
    "2008": "The Dark Knight",
    "1991": "Beauty And The Beast",
    "1994": "The Lion King"
  }];

  res.send(favoriteMovies);
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  res.send("Successfully returned data on movie title!");
});

// Return data about a genre (description) by name/title
app.get("/genre/:name", (req, res) => {
  res.send("Successfully returned data about genre description!");
});

// Return data about a director (bio, birth year, death year) by name
app.get("/director/:name", (req, res) => {
  res.send("Successfully returned data about director!");
});

// Allow new users to register
app.post("/users", (req, res) => {
  res.send("New user registered!");
});

// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:username", (req, res) => {
  res.send("User's [insert data] has been updated!");
});

// Allow users to add a movie to their list of favorites
app.post("/favorites/:name/movies/:movie", (req, res) => {
  res.send("User's added new movie to their favorites!");
});

// Allow users to remove a movie from their list of favorites
app.delete("/favorites/:username/movies/:movie", (req, res) => {
  res.send("User's deleted movie to their favorites!");
});

// Allow existing users to deregister
app.delete("/users/:username", (req, res) => {
  res.send("User's has been deregistered!");
});



app.listen(3000);
