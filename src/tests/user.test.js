const BASE_URL = '/api/v1/users'
const supertest = require('supertest')
const app = require('../app')
const request = require('supertest')
require('../models')


let TOKEN 

let userId

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

// POST (Create)
test("POST --> BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName", async() => {

    const columns = ["firstName", "lastName", "email", "phone"];
    
    const res = await request(app)
        .post(`${BASE_URL}`)
        .send(user)    
    
        userId = res.body.id;
            // console.log(userId)
            // console.log(res.body)
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toBeDefined();
    
        columns.forEach((column) => {
            expect(res.body[column]).toBeDefined();
            expect(res.body[column]).toBe(user[column]);
        })
    
            // For the hashedPassword, only verify if been defined.
        expect(res.body.password).toBeDefined()
    
})
    

test("GET -> BASE_URL, should return statusCode 200, and res.body.length == 2", async () => {
    const res = await supertest(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toHaveLength(2)
}) 

//login

test("GET -> BASE_URL/login, should return statusCode 200, and res.body.email === hits.email", async () => {
    const hits = {
        email: "wile@gmail.com",
        password: "wile1234"
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)


        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.user).toBeDefined()
        expect(res.body.token).toBeDefined()
        expect(res.body.user.email).toBeDefined()
        expect(res.body.user.email).toBe(hits.email)
        expect(res.body.user.password).toBeDefined()
})

    //  POST (Login error)
    test("POST --> BASE_URL/LOGIN, should return statusCode 401", async () => {

        const userLogin = {
            email: "rafael12@gmail.com",
            password: "invalid credentials"
        };

        const res = await request(app)
            .post(`${BASE_URL}/login`)
            .send(userLogin);

        expect(res.status).toBe(401);
    }); 
    

test("PUT --> BASE_URL/userId, should return statusCode 200, and res.body.user.firstName === userUpdate.firstName", async() => {
    const userUpdate = {
        firstName: "Pedro",
        lastName: "Lopez",
    }

    const res = await request(app)
        .put(`${BASE_URL}/${userId}`)
        .send(userUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)
    
        
        

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()

        const columns = ['firstName', 'lastName'];
        columns.forEach((item) => {
            expect(res.body[item]).toBeDefined()
            expect(res.body[item]).toBe(userUpdate[item])
        })
})

test("DELETE --> BASE_URL/userId, should return statusCode 204", async() => {
    const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
})