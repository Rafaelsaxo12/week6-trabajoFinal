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
        email: "test@email.com",
        password: "user1234",
    };
    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user)

        TOKEN = res.body.token;

        category = await Category.create({
            name: "laudry"
        })

        product = {
            title: "Stellar Blade",
            description: "The future of humanity is at stake in Stellar Blade, a new action-adventure story for PlayStation®5. Earth has been abandoned, ravaged by powerful and strange creatures, and the remnants of the decimated human race have escaped to a colony in outer space. From the Colony, EVE, a member of the VII Air Squadron, arrives on our desolate planet with a mission: save humanity and take back Earth from the clutches of the Naytibas, the malevolent force that has laid waste to everything. However, as EVE solves the mysteries of the past in the ruins of human civilization and defeats the Naytibas one by one, she realizes that her mission is not as simple as she thought. In fact, nothing will be as easy as it seems…",
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