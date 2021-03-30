const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// import the User model
const { User } = require('../../models');
const { checkIfLoggedInJWT } = require('../../middleware');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

// Hash password for registration and login
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

router.post('/login', async (req, res) => {
  let user = await User.where({
    email: req.body.email,
  }).fetch({
    require: false,
  });
  console.log(user);
  if (user && user.get('password') === getHashedPassword(req.body.password)) {
    let accessToken = generateAccessToken({
      username: user.get('username'),
      email: user.get('email'),
      id: user.get('id'),
    });
    res.send({ accessToken });
  } else {
    res.status(401);
    res.send({
      error: 'Invalid email and password',
    });
  }
});

router.get('/profile', checkIfLoggedInJWT, (req, res) => {
  let user = req.user;
  res.send(user);
});

module.exports = router;
