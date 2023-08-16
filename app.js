const express = require('express');

const items = require('./fakeDb');

const {add, find, modify, remove} = require('./cartFunctions');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// renders a list of shopping items
// [{"name": "popsicle", "price": 1.45}, {"name": "cheerios", "price": 3.40}]
app.get('/items', function(req, res){
    if (items.length){
        return res.status(200).json(items)
    }
    return res.status(404).json("Your cart is currently empty.")
});

// accepts JSON data and adds it to the shopping list.
// request is: {"name": "popsicle", "price": 1.45}
// response is: {"added": {"name": "popsicle", "price": 1.45}}
app.post('/items', function(req, res){
    let name = req.body.name;
    let price = req.body.price;
    let results = add(items, name, price);
    if(results){
        console.log(items);
        return res.status(200).json(results)
    }
    return res.status(404).json(`${name} is not a valid item.`)
});

// displays a single item's name and price based on name provided in parameters
// {"name": "popsicle", "price": 1.45}
app.get('/items/:name', function(req, res){
    let name = req.params.name;
    let results = find(items, name);
    if(results){
        return res.status(200).json(results)
    }
    return res.status(404).json(`${name} is not in your cart.`)
});

// modifies a single item's name and/or price.
// request is: {"name": "new popsicle", "price": 2.45}
// response is: {"updated": {"name": "new popsicle", "price": 2.45}}
app.patch('/items/:name', function(req, res){
    let name = req.params.name;
    let newName = req.body.name;
    let newPrice = req.body.price;
    if(newName && newPrice){
        let results = modify(items, name, newName=newName, newPrice=newPrice);
        if(results){
            return res.status(200).json(results)
        }
        return res.status(404).json('Please provide a valid string for newName and a valid number for newPrice.')
    }
    else if(newName != null){
        let results = modify(items, name, newName=newName);
        if(results){
            return res.status(200).json(results)
        }
        return res.status(404).json('Please provide a valid string for newName.')
    }
    else if(newPrice != null){
        let results = modify(items, name, newName=null, newPrice=newPrice);
        if(results){
            return res.status(200).json(results)
        }
        return res.status(404).json('Please provide a valid number for newPrice.')
    }
    return res.status(404).json('Please provide valid json.')
});

// deletes a specific item from the array.
// {message: "Deleted"}
app.delete('/items/:name', function(req, res){
    let name = req.params.name;
    let results = remove(items, name);
    if(results){
        return res.status(200).json(results)
    }
    return res.status(404).json(`${name} is not in your cart.`)
});

module.exports = app;