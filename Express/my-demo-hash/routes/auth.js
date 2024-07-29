const express = require('express');
const router = express.Router();
const expressError = require('../expressError');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config")
const { authenticateJWT, ensureLoggedIn, ensureAdmin } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.send("APP IS WORKING!")
})


router.post('/register', async(req, res,next) => {
    try{
        const{username, password} = req.body;
        if(!username || !password){
            throw new expressError("Username and password  required", 400);
        }
        //hash password
        const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        //save to db
        const results = await db.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username`, [username, hashedPw]);
       return res.json(results.rows[0]);
    } catch(e){
        if(e.code === '23505'){
            return next( new expressError("Username taken. Please pick another.", 400));
        }
        return next(e)
    }
})

router.post('/login', async(req, res,next) => {
    try{
        const{username, password} = req.body;
        if(!username || !password){
            throw new expressError("Username and password  required", 400);
        }
        const results = await db.query(`SELECT username, password
            FROM users WHERE username =$1`, [username])
        const user = results.rows[0]
        if(user){
           if( await bcrypt.compare(password, user.password)) {
               const token = jwt.sign({username, type: "admin"}, SECRET_KEY)
               return res.json({message: "Logged in!", token:token})
           }
        }
        throw new expressError("Invalid username/password", 400)//generic res
    }catch(e){
        return next(e)
    }
})


router.get('/topsecret', ensureLoggedIn, (req, res, next) => {
    try {
        return res.json({ msg: "SIGNED IN ! THIS IS TOP SECRET : I LOVE PURPLE" });
    } catch (e) {
        return next(new expressError("Please login first", 401));
    }
});

router.get('/private', ensureLoggedIn, (req, res, next) => {

       return  res.json({msg:`Welcome to my VIP section, ${req.user.username}`})

})

router.get('/adminhome', ensureAdmin, (req, res, next) => {

       return  res.json({msg:`ADMIN DASHBOARD, ${req.user.username}`})

})

module.exports = router;