const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "1a1a1a"},
  "9sm5xK": {longURL: "http://www.google.com", userId: "2b2b2b"}
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

const urlsForUser = (id) => {
  const myURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]['userID'] === id) {
      myURLs[url] = urlDatabase[url];
    }
  }
  return 
};


app.get('/urls/new', (req, res) => {
  if (!req.cookies['user_id']) {
    res.redirect('/login');
    return;
  }
  const templateVars = {
    user_id: req.cookies['user_id'],
    users
  }
  res.render('urls_new', templateVars)
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies['user_id'] };
  if (templateVars.user) {
    templateVars.urls = urlsForUser(templateVars.user['id']);
  }
  res.render('urls_index', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: req.cookies['user_id']
    };
  if (!templateVars.user || !(urlsForUser(templateVars.user['id'])[templateVars.shortURL])) {
    res.redirect('/login');
    return;
  }
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL =req.params.shortURL;
  const longURL = urlDatabase[shortURL]['longURL'];
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  const templateVars = { user: req.cookies['user_id'],valid: true};
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { user: req.cookies['user_id']};
  res.render('urls_login', templateVars);
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

app.post('/register', (req, res) => {
  if (!req.body['email'] || !req.body['password'] || !verification('email', req.body)) {
    const templateVars = {user: req.cookies['user_id'], valid: false };
    res.render('urls_register', templateVars);
    return;
  }
  if (verification('email', req.body)) {
    const email = req.body.email;
    const password = req.body.password;
    const id = generateRandomString(getRandomChar);
    users[id] = { id, email, password };
    res.cookie('user_id', users[id]);
    res.redirect('/urls');
  }
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString(getRandomChar);
  urlDatabase[shortURL] = { longURL: req.body.longURL,
    userID: req.cookies['user_id']['id'] 
  }
  res.redirect(`/urls/${shortURL}`);       
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const veri = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: req.cookies['user_id'] };
  if (!veri.user || !(urlsForUser(veri.user['id'])[veri.shortURL])) {
    res.redirect('/login');
    return;
  }
  urlDatabase[veri.shortURL]['longURL'] = req.body.urlupdate;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const veri = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: req.cookies['user_id'] };
  if (!veri.user || !(urlsForUser(veri.user['id'])[veri.shortURL])) {
    res.redirect('/login');
    return;
  }
  delete urlDatabase[veri.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

