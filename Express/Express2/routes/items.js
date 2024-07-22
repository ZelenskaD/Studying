const express = require("express");
const router = new express.Router();
const items = require("../fakeDb")
const ExpressError = require("../expressError");


//get all items
router.get('/', (req, res) => {
    res.json({items})
})

//add new item to the array of items (shopping list)
router.post('/', (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    throw new ExpressError("Request body must be an array of items", 400);
  }
  req.body.forEach(item => {
    if (!item.name || !item.price) {
      throw new ExpressError("Each item must have a name and price", 400);
    }
    items.push(item);
  });
  res.status(201).json({ items: req.body });
});

//get item by name
router.get('/:name', (req, res) => {
  const foundItem = items.find(item => item.name === req.params.name);
  if (!foundItem) {
    throw new ExpressError(`Item with name "${req.params.name}" not found`, 404);
  }
  res.json(foundItem);
});


//Update item by name
router.patch("/:name", (req,res) =>{
    const foundItem = items.find(item => item.name === req.params.name)
    if(!foundItem){
        throw new ExpressError("Item not found", 404)
    }
    if(req.body.name){
        foundItem.name = req.body.name;
    }
    if(req.body.price){
        foundItem.price = req.body.price;
    }
    res.json({item : foundItem});
})

router.delete("/:name", (req, res)=>{
    const foundItem = items.findIndex(item=> item.name === req.params.name)
    if(foundItem === -1) {
        throw new ExpressError("Item not found", 404)
    }
    items.splice(foundItem, 1)
    res.json({message: "Deleted"})
})


module.exports = router;