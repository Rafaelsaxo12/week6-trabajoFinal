require('../models');
const request = require('supertest');
const app = require('../app');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

let TOKEN;
let productId;
let cartItemId;
let category;
let product;
let user;
let userId;

const BASE_URL_LOGIN = '/api/v1/users/login';
const BASE_URL = '/api/v1/cart';

beforeAll(async() => {
    user = {
        email: "test@email.com",
        password: "user1234",
    };
    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user);

        userId = res.body.user.id;
        // console.log(res.body.user.id)
        TOKEN = res.body.token;
        // console.log(TOKEN)

    category = await Category.create({
        name: "Videogames",
    });
    // console.log(category)
    product = await Product.create({
        title: "Stellar Blase",
        description: "A new adventure story for PlayStation 5",
        price: 1600,
        categoryId: category.id,
    });
    // console.log(product)
});

afterAll(async() => {
    await Category.destroy({where: {id: category.id}});
    await Product.destroy({where: {id: productId}})
    await Cart.destroy({where: {userId}});
})

    // POST --> Create
test("POST --> BASE_URL, should return statusCode 201 and res.body.productId === product.id", async() => {
    const cartItem = {
        productId: product.id,
        quantity: 10,
    };
    const res = await request(app)
        .post(BASE_URL)
        .send(cartItem)
        .set('Authorization', `Bearer ${TOKEN}`)

        // console.log(res.body)
        cartItemId = res.body.id;
        productId = res.body.productId;
    
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.productId).toBe(product.id)
    expect(res.body.quantity).toBe(cartItem.quantity)
    expect(res.body.userId).toBe(userId)
});

    // GET --> GetAll
test("GET --> BASE_URL, should return statusCode 200 and res.body.length === 1", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`);

        // console.log(res.body)

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);
    expect(res.body[0].product).toBeDefined();
    expect(res.body[0].product.id).toBe(product.id);
    expect(res.body[0].product.categoryId).toBe(category.id);
});

    // GET --> GetOne
test("GET --> BASE_URL/:id, should return statusCode 200, and res.body.productId === product.id", async () => {
        const res = await request(app)
            .get(`${BASE_URL}/${cartItemId}`)
            .set('Authorization', `Bearer ${TOKEN}`);

            // console.log(res.body)
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(cartItemId);
    expect(res.body.productId).toBe(product.id);
    expect(res.body.product.categoryId).toBe(category.id);
});

    // PUT --> Update
test("PUT --> BASE_URL/:id, should return statusCode 200, and res.body.quantity === quantityUpdate", async () => {
    const quantityUpdate = 3;

    const res = await request(app)
        .put(`${BASE_URL}/${cartItemId}`)
        .send({ quantity: quantityUpdate })
        .set('Authorization', `Bearer ${TOKEN}`);

        // console.log(res.body)

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.quantity).toBe(quantityUpdate);
});

    // DELETE
test("DELETE --> BASE_URL/:id, should return statusCode 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${cartItemId}`)
        .set('Authorization', `Bearer ${TOKEN}`);

        // console.log(res.body)

    expect(res.statusCode).toBe(204);
});