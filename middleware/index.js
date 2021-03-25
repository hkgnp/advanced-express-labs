const checkIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash(
      'error_messages',
      'This page is only accessible to registered users who have logged in'
    );
    res.redirect('back');
  }
};

module.exports = { checkIfLoggedIn };
