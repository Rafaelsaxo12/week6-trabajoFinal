require('../models')
const request = require('supertest');
const app = require('../app');

let TOKEN;
let categoryId;

const BASE_URL = '/api/v1/categories';
const BASE_URL_LOGIN = '/api/v1/users/login';
const category = {
    name: "Videogames",
}

beforeAll(async() => {
    const user = {
        email: "test@email.com",
        password: "user1234",
    };
    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user)

        TOKEN = res.body.token;

        // console.log(TOKEN)
})

    // POST (create) 🔐
test("POST --> BASE_URL, should return statusCode 201, and res.body.name === category.name", async() => {
    const res = await request(app)
        .post(BASE_URL)
        .send(category)
        .set('Authorization', `Bearer ${TOKEN}`)

        // console.log(res.body)
        categoryId = res.body.id;

        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        expect(res.body.name).toBeDefined()
        expect(res.body.name).toBe(category.name)
})

    // GET (GetAll)
test("GET --> BASE_URL, should return statusCode 200, and res.body.length === 1", async() => {
    const res = await request(app)
        .get(BASE_URL)

        // console.log(res.body)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toHaveLength(1)
})

    // DELETE 🔐
test("DELETE --> BASE_URL, should return status 204", async() => {
    const res = await request(app)
        .delete(`${BASE_URL}/${categoryId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.statusCode).toBe(204)
})