/** Express app for pg-intro-demo */

const express = require("express");
const app = express();
const ExpressError = require("./expressError");

// Parse request bodies for JSON
app.use(express.json());

const uRoutes = require("./routes/users");
app.use("/users", uRoutes);

// ... 404, global err handler, etc.


app.use(function(req,res,next){
    const err = new ExpressError("Not Found", 404);

    return next(err);
});


//general error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  return res.json({
    error: err.message,
  });
});


module.exports = app;
