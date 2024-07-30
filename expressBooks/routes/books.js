const express = require('express');
const router = express.Router();
const ExpressError=require('../expressError')
const jsonschema=require('jsonschema');
const bookSchema = require('../schemas/bookSchema');

// router.post('/',(req,res,next)=>{
//     const bookData = req.body.book;
//
//     if(!bookData){
//
//         let error = new ExpressError("Book data is required", 400);
//         return next(error);
//     }
//
//     //(nit implemented) insert book into db here
//
//     return res.json(bookData);
// })

router.post('/',(req,res,next)=>{
    const result = jsonschema.validate(req.body, bookSchema);
    if(!result.valid){
        const listOfErrors = result.errors.map(e=>e.stack)
        const err = new ExpressError(listOfErrors,400);
        return next(err)
    }

    return res.json("THAT IS VALID DATA!")
})


module.exports = router;