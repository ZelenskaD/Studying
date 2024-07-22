const express = require("express");
const ExpressError = require("./expressError");
const app = express();// like app= FLASK(_name_)
const itemsRoutes =require("./routes/items");



app.use(express.json());
app.use("/items", itemsRoutes);

//404 handler
app.use(function(req,res,next){
    return new ExpressError("Not Found", 404);
})


//general error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  return res.json({
    error: err.message,
  });
});


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})