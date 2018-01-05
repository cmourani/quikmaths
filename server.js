// Dependencies
const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const db = require('./db/helpers.js');
const bcrypt = require('bcrypt');
const session = require('express-session');
const url = require('./db/config.js').url



app.use(bodyparser.json());

// Serve up static files
app.use(express.static(path.join(__dirname, '/client/www')));

app.use(session({
  secret: 'milksteak',
  resave: false,
  saveUninitialized: true
}));


const isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

const checkUser = function(req, res, next){
  if (!isLoggedIn(req)) {
    res.json(false)
  } else {
    next();
  }
};

const createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.json(newUser)
    });
};


app.get('/git', checkUser, (req, res) => {
    res.json(req.session)
  }
);


app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.end();
  });
});

// checks if username exists. if it doesn't it create the user in db
app.post('/signup', (req, res) => {
  db.doesUserExist(req.body.username, (exists) => {
    if (exists) {
      res.json(false);
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          req.body.password = hash;
          db.addNewUser(req.body, (err, userObj) => {
            if (err){
              res.json(false)
            } else {
              createSession(req, res, userObj.username)
            }
          });
        });
      });
    }
  })
});


app.post('/login', (req, res) => {
  db.getUserByName(req.body.username, (exists) => {
    if (!exists) {
      res.json(false);
    } else {
      bcrypt.compare(req.body.password, exists[0].dataValues.password, (err, result) => {
        if (result) {
          createSession(req, res, exists[0].dataValues.username)
        } else {
          console.log(result)
          res.json(false);
        }
      })
    }
  })
})

// returns all information about user that exists in database
/*
{
  "username": username,
}
*/
app.post('/user', (req, res) => {
  const username = req.body.username;
  db.getUserByName(username, (results) => {
    res.json(results);
  });
})

// save new record to database
/*
{
  "time": time,
  "numberCorrect": numberCorrect,
  "numberIncorrect": numberIncorrect,
  "score": score,
  "userId": userId,
  "operator": operator
}
*/
app.post('/newRecord', (req, res) => {
  db.addNewRecord(req.body);
  db.updateUser(req.body);
  res.send('Record Added to Database');
})

// update user info in database
/*
{
  "id": id,
  "username": username,
  "password": password,
  "totalCorrect": totalCorrect,
  "totalIncorrect", totalIncorrect,
  "gamesPlayed": gamesPlayed,
  "highScore": highScore,
  "bestTime": bestTime,
  "createdAt": createdAt,
  "updatedAt": updatedAt
}
*/

app.post('/updateUser', (req, res) => {
  db.updateUser(req.body, (user) => {
    res.json(user)
  });
})

// return all records for a user
/*
{
  "username": username,
  "operator": optional,
  "ascending": boolean
}
*/
app.post('/userRecords', (req, res) => {

  console.log('hi', req.body)
  const username = req.body.username;
  const ascending = req.body.ascending;
  const operator = req.body.operator
  
  db.getAllRecordsForUser(username, (records) => {
    if (operator) {
      records = records.filter(record => record.operator === operator);
    }

    if (ascending) {
      records = records.sort((a, b) => {return a.score - b.score});
      res.json(records.slice(0, 100));
    } else {
      let records = records.sort((a, b) => {return b.score - a.score});
      res.json(records.slice(0, 100));
    }
  })

})

// return all records
/*
{
  "operator": optional,
  "ascending": boolean
}
*/
app.post('/allRecords', (req, res) => {
  const ascending = req.body.ascending;
  const operator = req.body.operator;

  db.getAllRecords(records => {
    if (operator) {
      records = records.filter(record => record.operator === operator);
    }
    if (ascending) {
      records = records.sort((a, b) => {return a.score - b.score});
      res.json(records.slice(0, 100));
    } else {
      records = records.sort((a, b) => {return b.score - a.score});
      res.json(records.slice(0, 100));
    }
  });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));

