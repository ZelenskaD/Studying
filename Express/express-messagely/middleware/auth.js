const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const ExpressError = require('../expressError');

function authenticateJWT(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (err) {
    return next();
  }
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next(new ExpressError("Unauthorized", 401));
  } else {
    return next();
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      throw new ExpressError("Unauthorized", 401);
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
};
