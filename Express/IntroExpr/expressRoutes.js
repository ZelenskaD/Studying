const express = require('express');

const app = express();// like app= FLASK(_name_)

app.use(express.json());
app.use(express.urlencoded({extended: true}));





app.get('/', (req, res) => {

    res.send("HOMEPAGE!")

})

app.get('/dogs', (req, res) => {
    console.log("YOU ASKED FOR /DOGS ")
    console.log(req)
    res.send("<h1>WOOF WOOF</h1>")

})

app.post('/chickens', function createChicken(req, res) {
    res.send("<h1>You created a stupid chicken </h1>")

})

app.get('/chickens', (req, res) => {

    res.send("<h1>WOOF WOOF</h1>")

})




app.get("/greet/:language", (req, res) => {

  const greetings = {
    en: "hello",
    fr: "bonjour",
    ic: "hallo",
    ja: "konnichiwa"
}
    const lang = req.params.language;
    const greet = greetings[lang];
    if(!greet) res.send("INVALID LANGUAGE!");
    res.send(greet)
})

app.get('/search/', (req, res) => {
const {term, sort} = req.query;
// const {term = 'piggies', sort = 'top'} = req.query;
return res.send(`SEARCH PAGE! Term is: ${term}, sort is: ${sort}`)
})

app.get('/show-me-headers', (req, res) =>{
    console.log(req.rawHeaders)
    console.log(req.headers)
    res.send(req.headers)

});

app.get('/show-language', (req, res) =>{
    const lang = req.headers['accept-language']
    res.send(`Your language preference is ${lang}`)
})

app.post('/register', (req, res) => {
    res.send(`Welcome, ${req.body.username}`);
})





app.listen(3000, function(){
    console.log('App on port 3000')
})