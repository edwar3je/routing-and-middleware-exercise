const {add, find, modify, remove} = require('./cartFunctions');

let cart = [];

beforeEach(function() {
    cart = [];
});

describe('Add should add an item to the shopping cart.', function(){
    test('Add should add a valid item to the shopping cart', function(){
        expect(add(cart, 'ice cream', 2.50)).toEqual({"added": {"name": "ice cream", "price": 2.50}});
        expect(cart).toEqual([{name: 'ice cream', price: 2.50}])
    });
    test('Add should not add an item that contains a name that is a number', function(){
        expect(add(cart, 3.00, 2.50)).toEqual(false)
    });
    test('Add should not add an item that contains a price that is not a number', function(){
        expect(add(cart, 'steak', 'marshmallow')).toEqual(false)
    })
});

describe('Find should provide information on an item in the cart (if it exists).', function(){
    test('Find should work if the cart has items, the name provided is not a number and the item is in the cart', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(find(cart, 'ice cream')).toEqual({name: 'ice cream', price: 2.50})
    });
    test('Find should not work if the cart is empty', function(){
        expect(find(cart, 'ice cream')).toEqual(false)
    });
    test('Find should not work if the provided is a number', function(){
        expect(find(cart, 2.50)).toEqual(false)
    });
    test('Find should not work if the cart does not have an item that matches the name given', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(find(cart, 'steak')).toEqual(false)
    })
});

describe('Modify should modify the name and/or price of an item in the cart (if it exists).', function(){
    test('Modify should modify the name and/or price of an item that is in the cart', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(modify(cart, 'ice cream', newName='new ice cream', newPrice=2.25)).toEqual({'updated': {'name': 'new ice cream', 'price': 2.25}});
        expect(find(cart, 'new ice cream')).toEqual({name: 'new ice cream', price: 2.25});
    });
    test('Modify should not modify the cart if the cart is empty', function(){
        expect(modify(cart, 'ice cream', newName='new ice cream', newPrice=2.25)).toEqual(false);
    });
    test('Modify should not modify an item if it is not in the cart', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(modify(cart, 'beer', newName='new beer', newPrice=6.00)).toEqual(false);
    });
    test('Modify should not modify an item if neither newName nor newPrice remain null', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(modify(cart, 'ice cream')).toEqual(false);
    });
    test('Modify should not modify an item if either the newName is a number or the newPrice is not a number', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(modify(cart, 'ice cream', newName=2.25, newPrice='new ice cream')).toEqual(false);
    });
});

describe('Remove should remove a specific item from the shopping cart (if it exists)', function(){
    test('Remove should remove a specific item if it is in the cart', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(remove(cart, 'ice cream')).toEqual({message: "Deleted"});
        expect(cart).toEqual([]);
    });
    test('Remove should not work if the cart is empty', function(){
        expect(remove(cart, 'ice cream')).toEqual(false)
    });
    test('Remove should not work if the item is not in the cart', function(){
        cart.push({name: 'ice cream', price: 2.50});
        expect(remove(cart, 'steak')).toEqual(false)
    });
});