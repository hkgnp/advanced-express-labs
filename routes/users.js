const express = require('express');
const router = express.Router();

// import the User model
const { User } = require('../models');

// import the forms
const { createUserForm, bootstrapField } = require('../forms');

router.get('/register', (req, res) => {
  const registrationForm = createUserForm();
  res.render('users/register', {
    form: registrationForm.toHTML(bootstrapField),
  });
});

module.exports = router;
