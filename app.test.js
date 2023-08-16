process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const items = require("./fakeDb");

beforeEach(function() {
    items.push({name: "banana", price: 3.09});
});

afterEach(function() {
    items.length = 0;
})

describe("GET /items", function(){
    test("GET /items will display all items in cart if cart has items", async function(){
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([{name: "banana", price: 3.09}])
    });
    test("GET /items will display a special string if there are no items in the cart", async function(){
        items.pop();
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("Your cart is currently empty.")
    })
});

describe("POST /items", function(){
    test("POST /items will add a new item to the cart if the name and price provided are a string and number respectively", async function(){
        const resp = await request(app)
            .post("/items")
            .send({
                name: "coke",
                price: 2.49
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"added": {"name": "coke", "price": 2.49}})
        expect(items).toContainEqual({"name": "coke", "price": 2.49})
    });
    test("POST /items will not add an item to the cart if the name is a number", async function(){
        const resp = await request(app)
            .post("/items")
            .send({
                name: 3.00,
                price: 2.49
            });
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("3 is not a valid item.")
    });
    test("POST /items will not add an item to the cart if the price is not a number (NaN)", async function(){
        const resp = await request(app)
            .post("/items")
            .send({
                name: "coke",
                price: "something"
            });
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("coke is not a valid item.")
    })
});

describe("GET /items/:name", function(){
    test("GET /items/:name will display information if the item provided in the parameters is in the cart", async function(){
        const resp = await request(app).get('/items/banana');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"name": "banana", "price": 3.09})
    });
    test("GET /items/:name will not display a special string if the item provided in the parameters is not in the cart", async function(){
        const resp = await request(app).get("/items/coke");
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("coke is not in your cart.")
    })
});

describe("PATCH /items/:name", function(){
    test("PATCH /items/:name will modify both the name and price of an item if it is in the cart, if the new name is not a number and if the new price is a number", async function(){
        const resp = await request(app)
            .patch("/items/banana")
            .send({
                name: "Banana",
                price: 4.09
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {"name": "Banana", "price": 4.09}});
        expect(items).toContainEqual({"name": "Banana", "price": 4.09})
    });
    test("PATCH /items/:name will display a special string if the new name provided is a number", async function(){
        const resp = await request(app)
            .patch("/items/banana")
            .send({
                name: 4.78,
                price: 4.09
            });
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("Please provide a valid string for newName and a valid number for newPrice.");
        expect(items).toContainEqual({"name": "banana", "price": 3.09})
    });
    test("PATCH /items/:name will display a special string if the new price provided is not a number", async function(){
        const resp = await request(app)
            .patch("/items/banana")
            .send({
                name: "Banana",
                price: "something"
            });
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("Please provide a valid string for newName and a valid number for newPrice.");
        expect(items).toContainEqual({"name": "banana", "price": 3.09})
    });
    test("PATCH /items/:name will only modify the name if only the new name is sent", async function(){
        const resp = await request(app)
            .patch("/items/banana")
            .send({
                name: "Banana"
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {"name": "Banana"}});
        expect(items).toContainEqual({"name": "Banana", "price": 3.09})
    });
    test("PATCH /items/:name will only modify the price if only the new price is sent", async function(){
        const resp = await request(app)
            .patch("/items/banana")
            .send({
                price: 4.09
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {"price": 4.09}});
        expect(items).toContainEqual({"name": "banana", "price": 4.09})
    });
    test("PATCH /items/:name will display a special string if the new price and new name are not sent", async function(){
        const resp = await request(app)
            .patch("/items/banana")
            .send({
                name: null,
                price: null
            });
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual('Please provide valid json.');
    })
});

describe("DELETE /items/:name", function(){
    test("DELETE /items/:name will delete an item from the cart if the item is in the cart", async function(){
        const resp = await request(app).delete("/items/banana");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Deleted"});
        expect(items.length).toEqual(0)
    });
    test("DELETE /items/:name will display a special string if the item provided in the parameters is not in the cart", async function(){
        const resp = await request(app).delete("/items/coke");
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("coke is not in your cart.");
        expect(items.length).toEqual(1)
    });
    test("DELETE /items/:name will display a special string if the cart is empty", async function(){
        items.pop();
        const resp = await request(app).delete("/items/banana");
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual("banana is not in your cart.");
    })
})