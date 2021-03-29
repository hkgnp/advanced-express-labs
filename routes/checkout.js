const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/checkout', async (req, res) => {
  //1. Create line items = tell Stripe what customer is paying for
  //2. Use Stripe to create payment
  //3. Register payment
  //4. Send payment session ID to HBS file and use JS to redirect
});

module.exports = router;
