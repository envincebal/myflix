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

app.get("/movies", (req, res) => {
  let favoriteMovies = {
    "2005": "V For Vendetta",
    "1980": "The Empire Strikes Back",
    "2008": "The Dark Knight",
    "1991": "Beauty And The Beast",
    "1994": "The Lion King"
  }

  res.send(favoriteMovies);
});

app.listen(3000);