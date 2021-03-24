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
    if (urlDatabase[url].user === id) {
      myURLs[url] = urlDatabase[url];
    }
  }
  return myURLs;
};

const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user]['email']) {
      return database[user]['id'];
    }
  }
};

module.exports = {
  users,
  urlDatabase,
  getRandomChar,
  generateRandomString,
  verification,
  getUserByEmail,
  urlsForUser };