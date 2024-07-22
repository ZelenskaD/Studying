const express = require("express");
const ExpressError = require("./expressError");
const middleware = require("./middleware");
const morgan=require("morgan");

// const router = new express.Router();

const userRoutes = require("./userRoutes")

const app = express();// like app= FLASK(_name_)

app.use(express.json());
app.use(middleware.logger)//run for every single request
app.use(morgan('dev'));


app.use("/users", userRoutes);
app.get('/favicon.ico', (req, res) =>
    res.sendStatus(204)
)


app.get('/secret', middleware.checkForPassword, (req, res, next)=>{
   return  res.send("DEMON LOVES ELENA 2024")
})

app.get('/private',middleware.checkForPassword, (req, res, next)=>{
    return res.send("YOU HAVE REACHED THE PRIVATE PAGE.")
})


app.use((req, res)=>{
    return new ExpressError("Page Not Found", 404)
})



app.use(function(err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: {message, status}
  });
});




module.exports = app;