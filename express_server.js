const { urlDatabase, users, getRandomChar, generateRandomString, verification, getUserByEmail, urlsForUser } = require('./helpers');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect("/login");
  } else {
    return res.redirect("/urls");
  }
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  if (!templateVars.user) {
    res.redirect('/login');
    return;
  }
  res.render('urls_new', templateVars);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  if (templateVars.user) {
    templateVars.urls = urlsForUser(templateVars.user['id']);
  }
  res.render('urls_index', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session.user_id],
    owner: true
  };
  if (templateVars.user && !(urlsForUser(templateVars.user['id'], urlDatabase)[templateVars.shortURL])) {
    templateVars['owner'] = false;
    res.render("urls_show", templateVars);
    return;
  }
  res.render("urls_show", templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURl = urlDatabase[shortURL]['longURL'];
  res.redirect(longURl);
});

// app.get('/', (req, res) => {
//   const vari = { user: users[req.session.user_id] };
//   if (vari.user) {
//     res.redirect('/urls');
//     return;
//   } else if (includes('https://', 'http://' )) {
//     res.redirect('login');
//   }
// });

app.get('/register', (req, res) => {
  const templateVars = { user: users[req.session.user_id], valid: true};
  if (templateVars.user) {
    templateVars['user'] = users[req.session.user_id];
  }
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  if (req.body.email && verification('email', req.body)) {
    res.sendStatus(403);
    return;
  }
  const id = getUserByEmail(req.body.email, users);
  const password = users[id]['password'];
  if (req.body.password && !bcrypt.compareSync(req.body.password, password)) {
    res.sendStatus(403);
    return;
  }
  req.session.user_id = users[id]['id'];
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  if (!req.body['email'] || !req.body['password'] || !verification('email', req.body)) {
    const templateVars = { user: users[req.session.user_id], valid: false };
    res.render('urls_register', templateVars);
    return;
  }
  if (verification('email', req.body)) {
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    const id = generateRandomString(getRandomChar);
    users[id] = { id, email, password };
    req.session.user_id = id;
    res.redirect('/urls');
  }
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString(getRandomChar);
  urlDatabase[shortURL] = { longURL: req.body.longURL, user: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/', (req, res) => {
  const vari = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session.user_id] };
  if (!vari.user || !(urlsForUser(vari.user['id'], urlDatabase)[vari.shortURL])) {
    res.redirect('/login');
    return;
  }
  urlDatabase[vari.shortURL]['longURL'] = req.body.urlupdate;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const vari = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session.user_id] };
  if (!vari.user || !(urlsForUser(vari.user['id'])[vari.shortURL])) {
    res.redirect('/login');
    return;
  }
  delete urlDatabase[vari.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

