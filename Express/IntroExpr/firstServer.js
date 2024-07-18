const express = require('express');

const app = express();// like app= FLASK(_name_)

app.listen(3000, function(){
    console.log('App on port 3000')
})