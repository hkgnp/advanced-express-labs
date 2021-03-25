const express = require('express');
const router = express.Router();

// import the User model
const { User } = require('../models');

// import the forms
const { createUserForm, bootstrapField, loginUserForm } = require('../forms');

router.get('/register', (req, res) => {
  const registrationForm = createUserForm();
  res.render('users/register', {
    form: registrationForm.toHTML(bootstrapField),
  });
});

router.post('/register', async (req, res) => {
  const registrationForm = createUserForm();
  registrationForm.handle(req, {
    success: async (form) => {
      let { confirm_password, ...userData } = form.data;

      const newUser = new User();
      newUser.set(userData);
      await newUser.save();

      req.flash('success_messages', 'You have been registered successfully');
      res.redirect('/users/login');
    },
    error: (form) => {
      res.render('users/register', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/login', (req, res) => {
  const registrationForm = loginUserForm();
  res.render('users/login', {
    form: registrationForm.toHTML(bootstrapField),
  });
});

router.login('/login', (req, res) => {
  const loginForm = loginUserForm();
  loginForm.handle(req, {
    success: async (form) => {
      // Check if user exists
      let user = await User.where({
        email: form.data.email,
      }).fetch();

      // If user exists, check password
      if (user) {
        // Password matches, save the user to the session
      } else {
        // If password doesn't match, go to login page
        req.flash(
          'error_messages',
          'Please double check your email and password and try logging in again'
        );
        res.redirect('/users/login');
      }
    },
  });
});

module.exports = router;
