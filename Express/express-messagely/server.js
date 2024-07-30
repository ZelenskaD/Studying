/** Server startup for Message.ly. */

const app = require("./app");
const PORT = process.env.PORT || 3000;
// const ExpressError=require('expressError')


app.listen(PORT, function () {
  console.log("Listening on 3000");
});