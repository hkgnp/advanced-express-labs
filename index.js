const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const cors = require('cors');
const landingRoutes = require('./routes/landing');
const corporateRoutes = require('./routes/corporate');
const productsRoutes = require('./routes/products');

// create an instance of express app
let app = express();

// set the view engine
app.set('view engine', 'hbs');

// static folder
app.use(express.static('public'));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

(async () => {
  app.use('/', landingRoutes);
  app.use('/company', corporateRoutes);
  app.use('/products', productsRoutes);
})();

app.listen(3001, () => {
  console.log('Server has started on port 3001');
});
