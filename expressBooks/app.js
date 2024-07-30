/** Express app for auth-api. */

const express = require("express");
const app = express();

const ExpressError = require("./expressError");


app.use(express.json());
const bookRoutes = require("./routes/books");
app.use("/books", bookRoutes)

/** 404 catch --- passes to next handler. */

app.use(function (req, res, next) {
  const err = new ExpressError("Not found!",404);
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})
module.exports = app;
