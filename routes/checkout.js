const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/checkout', async (req, res) => {
  //1. Create line items = tell Stripe what customer is paying for
  const cartService = new CartServices(req.session.user.id);
  let allCartItems = cartService.getAll();

  let lineItems = [];
  let meta = [];

  for (let cartItem of allCartItems) {
    const lineItem = {
      name: cartItem.related('product').get('name'),
      amount: cartItem.related('product').get('cost'),
      quantity: cartItem.get('quantity'),
      currency: SGD
    };
    // Check if the related product has an image
    if (cartItem.related('product').get('image_url')) {
        lineItem.images = [cartItem.related('product').get('image_url')]
    }
    lineItems.push(lineItem);
    // Keep track of each product's quantity purchase
    meta.push({
        'product_id':cartItem.get('product_id');
        'quantity': cartItem.get('quantity')
    })
  }

  //2. Use Stripe to create payment
  let metaData = JSON.stringify(meta);
  const payment = {
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId = {CHECKOUT_SESSION_ID}',
      cancel_url: process.env.STRIPE_ERROR_URL,
    metadata: {
    orders: metaData,
},
  }
  //3. Register payment
  let stripeSession = await stripe.checkout.sessions.create(payment);

  //4. Send payment session ID to HBS file and use JS to redirect
  res.render('checkout/checkout', {
    sessionId: stripeSession.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
})
});

module.exports = router;
