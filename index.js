const express = require('express');
const hbs = require('hbs');
const moment = require('moment');
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

// date time
hbs.registerHelper('dateFormat', function (date, options) {
  const formatToUse =
    (arguments[1] && arguments[1].hash && arguments[1].hash.format) ||
    'DD/MM/YYYY';
  return moment(date).format(formatToUse);
});

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
