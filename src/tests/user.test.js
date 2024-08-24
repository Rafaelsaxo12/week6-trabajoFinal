const BASE_URL = '/api/v1/users'
const supertest = require('supertest')
const app = require('../app')
const request = require('supertest')
require('../models')


let TOKEN 

beforeAll(async () => {
    const user = {
        email: "rafa@gmail.com",
        password: "rafa1234"
    }
    const res = await request (app)
        .post(`${BASE_URL}/login`)
        .send(user)
        TOKEN = res.body.token        
})

const user = {
    firstName: "Wilesca",
    lastName: "Santana",
    email: "wile@gmail.com",
    password: "wile1234",
    phone: "+584142385574"
}

test("POST -> BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName", async () => {

    const res = await request(app)
        .post(BASE_URL)
        .send(user)

        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        expect(res.body.firstName).toBeDefined()
        expect(res.body.firstName).toBe(user.firstName)
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length == 2", async () => {
    const res = await supertest(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toHaveLength(2)
}) 