const express = require('express');
const router = express.Router();

// import cloudinary
const cloudinary = require('cloudinary');

router.get('/sign', async (req, res) => {
  // retrieve params to send to cloudinary
  // retrieve api secret from config vars
  // get csrf token
});

module.exports = router;
