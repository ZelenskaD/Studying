const express = require('express');

const app = express();// like app= FLASK(_name_)
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const CANDIES =[
    {name: 'snickers', qty:43, price: 1.50},
    {name: 'skittles', qty:26, price: 0.99}
]


app.get('/candies', (req, res) => {
    res.json(CANDIES)

})

app.post('/candies', (req, res) => {
    if(req.body.name.toLowerCase()==="circus peanuts"){
        res.status(403).json({msg:"HORRIBLE CHOICE. CIRCUS PEANUTS FORBIDDEN!"})
    }
    CANDIES.push(req.body);
    res.status(201).json(CANDIES)

})
//
// app.get('/', (req, res) => {
//     return res.status(404).json('Whoops!Nothing here!')
// })




app.listen(3000, function(){
    console.log('App on port 3000')
})