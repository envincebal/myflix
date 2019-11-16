const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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
  Movies.find()
    .then(movies => {
      res.status(201).json(movies);
    }).catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:Title", (req, res) => {
  Movies.find({
      Title: req.params.Title
    })
    .then(movie => {
      res.status(201).json(movie);
    }).catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a genre (description) by name/title
app.get("/genre/:Name", (req, res) => {
  Movies.find({
      "Genre.Name": req.params.Name
    })
    .then(movie => {
      res.status(201).json(movie[0].Genre);
    }).catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a director (name, bio, birth year) by name
app.get("/director/:Name", (req, res) => {
  Movies.find({
      "Director.Name": req.params.Name
    })
    .then(movie => {
      res.status(201).json(movie[0].Director);
    }).catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get user by username
app.get("/users/:Username", (req, res) => {

  Users.findOne({
      Username: req.params.Username
    })
    .then(user => {
      console.log(user.FavoriteMovies);
      res.json(user);
    }).catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
})

// Allow new users to register
app.post("/users", (req, res) => {
  Users.findOne({
      Username: req.body.Username
    })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists.");
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            BirthDate: new Date(req.body.BirthDate)
          })
          .then(user => res.status(201).json(user))
          .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err + " ");
          })
      }
    }).catch(err => {
      console.error(err);
      res.status(500).send(" Error: " + err);
    });
});

// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        BirthDate: req.body.Birthday
      }
    }, {
      new: true
    })
    .then(updatedUser => res.json(updatedUser))
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});

// Allow users to add a movie to their list of favorites
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    })
    .then(updatedUser => res.json(updatedUser))
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Allow users to remove a movie from their list of favorites
app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate({
    Username: req.params.Username
  }, {
    $pull: {
      FavoriteMovies: req.params.MovieID
    }
  }).then(movie => {
    if (!movie) {
      res.status(400).send(req.params.MovieID + "  was not found.");
    } else {
      res.status(200).send(req.params.MovieID + " has been deleted.");
    }
  }).catch(err => {
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

// Allow existing users to deregister
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({
    Username: req.params.Username
  }).then(user => {
    if (!user) {
      res.status(400).send(req.params.Username + "  was not found.");
    } else {
      res.status(200).send(req.params.Username + " has been deleted.");
    }
  }).catch(err => {
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

app.listen(3000);
