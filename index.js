const express = require('express');
const hbs = require('hbs');
const moment = require('moment');
const wax = require('wax-on');
require('dotenv').config();
const cors = require('cors');
const landingRoutes = require('./routes/landing');
const corporateRoutes = require('./routes/corporate');
const productsRoutes = require('./routes/products');
const session = require('express-session');
const flash = require('connect-flash');

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

// set up session
app.use(
  session({
    // Secret key for the session. Needs to be complex.
    secret: 'secret',
    // Will not resave the session if there are no changes to the session
    resave: false,
    // If a user comes in without a session, immediately create one
    saveUninitialized: true,
  })
);

// Set up flash
app.use(flash());

// Set up middleware: something that sits between the route and the user
app.use((req, res, next) => {
  // Inject success and error messages into the hbs file
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

const main = async () => {
  app.use('/', landingRoutes);
  app.use('/company', corporateRoutes);
  app.use('/products', productsRoutes);
};

main();

app.listen(3000, () => {
  console.log('Server has started on port 3000');
});
