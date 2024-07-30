const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const { authenticateJWT } = require('./middleware/auth');

app.use(express.json());
app.use(authenticateJWT);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

// 404 handler
app.use((req, res, next) => {
  return next(new ExpressError("Not Found", 404));
});

// General error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;

