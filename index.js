const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const Models = require("./models.js");
const cors = require("cors");
const {
  check,
  validationResult
} = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

mongoose.connect("mongodb+srv://envincebal:.357magnum@myflixdb-luj5p.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

var auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(express.static("public"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get("/", (req, res) => {
  res.redirect("Welcome to MyFlix!");
});

//Return a list of ALL movies to the user
app.get("/movies", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(201).json(movies);
    }).catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:Title", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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
app.get("/genre/:Name", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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
app.get("/director/:Name", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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
app.get("/users/:Username", passport.authenticate('jwt', {
  session: false
}), (req, res) => {

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
app.post('/users',
  [check('Username', 'Username is required').isLength({
      min: 5
    }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({
        Username: req.body.Username
      }) // Search to see if a user with the requested username already exists
      .then(function (user) {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then(function (user) {
              res.status(201).json(user)
            })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:Username", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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
app.post("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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
app.delete("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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
app.delete("/users/:Username", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on Port " + port);
});