import { expect, assert } from "chai";
import supertest from "supertest"


const requester = supertest('http://localhost:8080')

describe('Testeo del proyecto', () => {
    describe('Test /api/products', () => {
        const user = {
            email: "leandromart@hotmail.com",
            password: "123456"
        }

        // Seteamos la cookie para que el servidor nos tome al usuario como logeado.
        let cookie;
        before(async () => {
            const login = await requester.post('/session/login').send({ email: user.email, password: user.password }).expect(302)
            cookie = login.header["set-cookie"].find((cookie) => cookie.startsWith("connect.sid"));
        });

        it('Obtiene la lista de productos en el endpoint GET de api/products', async () => {

            const response = await requester.get('/api/products')
                .set("Cookie", cookie) // Seteo la cookie
                .expect(200);

            expect(response.body.response.status).to.equal('success')
        })

        it('El endpoint POST de api/products debe agregar un producto', async () => {

            const product = {
                title: "Test ",
                description: "Test para agregar un producto",
                price: 17,
                code: "testingADD01",
                stock: 25,
                category: "testCategory",
                thumbnail: ["https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_640.jpg"],
                owner: ""
            }
            const response = await requester.post('/api/products').send(product)
                .set("Cookie", cookie) // Seteo la cookie
                .expect(201);
            const { body } = response
            expect(body.payload).to.be.ok;
            expect(body.payload.response.payload).to.have.property('_id')
        })
    })
    describe('Test /api/carts', () => {

    })

    describe('Test /session', () => {
        
    })
})