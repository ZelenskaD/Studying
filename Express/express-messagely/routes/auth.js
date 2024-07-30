const express = require('express');
const router = express.Router();
const ExpressError = require('../expressError');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const bcrypt = require('bcrypt');
const db = require('../db');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 **/
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }

    const results = await db.query(`SELECT username, password FROM users WHERE username = $1`, [username]);
    const user = results.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ username }, SECRET_KEY);
        await User.updateLoginTimestamp(username);
        return res.json({ message: "Logged in!", token });
      }
    }

    throw new ExpressError("Invalid username/password", 400);
  } catch (e) {
    return next(e);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    if (!username || !password || !first_name || !last_name || !phone) {
      throw new ExpressError("All fields are required", 400);
    }

    const newUser = await User.register({ username, password, first_name, last_name, phone });
    const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
    await User.updateLoginTimestamp(username);
    return res.json({ message: "Registered successfully!", token });
  } catch (e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another.", 400));
    }
    return next(e);
  }
});

module.exports = router;

