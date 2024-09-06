require('../models')
const request = require('supertest');
const app = require('../app');
const Category = require('../models/Category');

let TOKEN;
let productId;
let category;
let product;

const BASE_URL_LOGIN = '/api/v1/users/login';
const BASE_URL = '/api/v1/products';


beforeAll(async() => {
    const user = {
        email: "rafa@gmail.com",
        password: "rafa1234"
    }
    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user)

        TOKEN = res.body.token;

        category = await Category.create({
            name: "laudry"
        })

        product = {
            title: "God of War",
            description: "The god of war return to a new adventure in ps5",
            price: 1600,
            categoryId: category.id
        }
        
})

afterAll((async () => {
    await category.destroy()
}))


// POST (Create) 🔐
test("POST --> BASE_URL, should return statusCode 201, and res.body.title === product.title", async() => {
    const res = await request(app)
        .post(BASE_URL)
        .send(product)
        .set('Authorization', `Bearer ${TOKEN}`)

        productId = res.body.id;

        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        const columns = ['title', 'description', 'price', 'categoryId'];
        columns.forEach((column)=>{
            expect(res.body[column]).toBeDefined()
            expect(res.body[column]).toBe(product[column])
        })
})

    // GET (GetAll)
test("GET --> BASE_URL, should return statusCode 200 and res.body.length === 1", async() => {
    const res = await request(app)
        .get(BASE_URL)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toHaveLength(1)

        expect(res.body[0].category.id).toBeDefined()
        expect(res.body[0].category.id).toBe(category.id)
})

    // GET (GetOne)
test("GET --> BASE_URL/:id, should return statusCode 200, and res.body.title === product.title", async() => {
    const res = await request(app)
        .get(`${BASE_URL}/${productId}`)

        // console.log(res.body)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        const columns = ['title', 'description', 'price', "categoryId"];
        columns.forEach((column)=>{
            expect(res.body[column]).toBeDefined()
            expect(res.body[column]).toBe(product[column])
        })
        expect(res.body.category.id).toBeDefined()
        expect(res.body.category.id).toBe(category.id)
})

    // PUT (Update) 🔐
test("PUT --> BASE_URL/:id, should return statusCode 200, and res.body.title === productUpdate.title", async() => {
    const productUpdate = {
        title: "Dark Souls",
        description: "Dark Souls is a dark fantasy action role-playing game series developed by FromSoftware and published by Bandai Namco Entertainment. Created by Hidetaka Miyazaki, the series began with the release of Dark Souls (2011) and has seen two sequels, Dark Souls II (2014) and Dark Souls III (2016). ",
        price: 1500,
        categoryId: 1
    }
    const res = await request(app)
        .put(`${BASE_URL}/${productId}`)
        .send(productUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)


        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        const columns = ['title', 'description', 'price', "categoryId"];
        columns.forEach((column)=>{
            expect(res.body[column]).toBeDefined()
            expect(res.body[column]).toBe(productUpdate[column])
        })
})

    //DELETE 🔐
test("DELETE --> BASE_URL/:id, should return statusCode 204", async() => {
    const res = await request(app)
        .delete(`${BASE_URL}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.statusCode).toBe(204)
})