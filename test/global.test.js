import { expect, assert } from "chai";
import supertest from "supertest"
import { fakerES as faker } from '@faker-js/faker'


const requester = supertest('http://localhost:8080')

describe('Testeo del proyecto', () => {
    const user = {
        email: "leandromart@hotmail.com",
        password: "123456"
    }

    describe('Test endpoint /api/products', () => {

        // Seteamos la cookie para que el servidor nos tome al usuario como logeado.
        let cookie;
        before(async () => {
            const login = await requester.post('/session/login').send({ email: user.email, password: user.password }).expect(302)
            cookie = login.header["set-cookie"].find((cookie) => cookie.startsWith("connect.sid"));
        });

        it('GET / - Obtiene la lista de todos los productos', async () => {

            const response = await requester.get('/api/products')
                .set("Cookie", cookie) // Seteo la cookie
                .expect(200);
            const { body } = response
            expect(body).to.be.ok;
            expect(body.response.status).to.equal('success')
        })

        it('POST / - Crea un nuevo producto', async () => {

            const product = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price({ min: 10, max: 150 }),
                code: faker.string.hexadecimal({ length: 10 }),
                category: faker.commerce.department(),
                stock: faker.number.int({ max: 100 }),
                thumbnail: [faker.image.avatar(({ height: 480, width: 640 }))]
            }
            const response = await requester.post('/api/products').send(product)
                .set("Cookie", cookie) // Seteo la cookie
                .expect(201);
            const { body } = response
            expect(body.payload).to.be.ok;
            expect(body.payload.response.payload).to.have.property('_id')
        })
    })

    describe('Test endpoint /api/carts', () => {
        // Seteamos la cookie para que el servidor nos tome al usuario como logeado.
        let cookie;
        before(async () => {
            const login = await requester.post('/session/login').send({ email: user.email, password: user.password }).expect(302)
            cookie = login.header["set-cookie"].find((cookie) => cookie.startsWith("connect.sid"));
        });
        it('POST /:cid/product/:pid - Agrega un producto al carrito', async () => {

            const cartID = "658cb8c99fbc050fabf11fac"
            const productID = "6583c3f9f3a2c28a2e9a036c"
            const response = await requester.post(`/api/carts/${cartID}/product/${productID}`)
                .set("Cookie", cookie)
                .expect(200)

            const { body } = response
            expect(body).to.be.ok;
            expect(body.products).to.be.an('array')
        })
        it('GET /:cid - Obtiene los productos de un carrito especifico', async () => {
            const cartID = "65824f2444b4ccba0ad1d959"
            const response = await requester.get(`/api/carts/${cartID}`)
                .set("Cookie", cookie)
                .expect(200)
            const { body } = response
            expect(body).to.be.ok;
            expect(body._id).to.be.equal(cartID);
            expect(body.products).to.be.an('array');
        })
    })

    describe('Test endpoint /session', () => {
        it('POST /login - Loguea un usuario al sistema', async () => {

            const response = await requester.post('/session/login').send({ email: user.email, password: user.password })
                .expect(302)
            const cookie = response.header["set-cookie"].find((cookie) => cookie.startsWith("connect.sid"))
            expect(cookie).to.be.ok;
            expect(cookie).to.be.an('string')
        })
        it('POST /register - Crea y registra un usuario en sistema', async () => {

            const userReg = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                age: faker.number.int({ min: 18, max: 100 }),
                password: "password123",

            }
            const { text } = await requester.post('/session/register').send(userReg)
                .expect(302)
            // Si se reedireccionó al cliente a la página de registro aceptado, pasa el test.
            expect(text).to.include('registerAccepted')
        })
    })
})