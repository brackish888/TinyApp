const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  
};
const verification = (userProperty, reqBody) => {
  for (const user in users) {
    if (reqBody[userProperty] === users[user][userProperty]) {
      return false;
    }
  }
  return true;
};

const getRandomChar = (string) => {
  return Math.floor(Math.random() * string.length);
};

const generateRandomString = (callback) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += letters[callback(letters)];
  }
  return randomString;
};


app.get('/urls/new', (req, res) => {
  const templateVars = { user: req.cookies['user_id'] };
  res.render('urls_new', templateVars)
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies['user_id']
    };
  res.render('urls_show', templateVars);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies['user_id'] };
  res.render('urls_index', templateVars);
});

// app.get('/hello', (req, res) => {
//   res.send('<html><body>Hello <b>World</b></body></html>\n');
// });

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

app.get('/register', (req, res) => {
  const templateVars = { user: req.cookies['user_id'],valid: true};
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { user: req.cookie['user_id']};
  res.render('/urls_login', templateVars);
});

app.post('/login', (req, res) => {
  if (verification('email', req.body)) {
    res.sendStatus(403);
    return;
  }
  if (verification('password', req.body)) {
    res.sendStatus(403);
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString(getRandomChar);
  users[id] = { id, email, password };
  res.cookie('user_id', user[id]);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/urls', (req, res) => {
// Logs the POST request body to the console
  const shortURL = generateRandomString(getRandomChar);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);       
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.urlupdate;
  res.redirect(`/urls${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  //deletes saved urls
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

