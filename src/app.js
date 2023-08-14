import express from 'express'
import ProductManager from './productManager.js'

const app = express();
const productManager = new ProductManager('./products.json')

app.get('/', (req, res) => {
    res.send('<h1>Hello world!!</h2>')
})

app.get('/products', async (req, res) => {

    const result = await productManager.getProducts()
    const limit = req.query.limit
    if (!limit) return res.send(result)
    if (limit == 0) return res.send('<h1>Array is empty</h1>')
    let resultFilt = result.slice(0, limit)
    return res.send(resultFilt)
})

app.get('/products/:id', async (req, res) => {

    const id = req.params.id
    const result = await productManager.getProductByID(id)
    if (!result) return res.send('<h1>No existe el objeto con el ID especificado.</h1>')
    return res.send(result)

})

// App funciona como servidor web, escuchamos las peticiones en el puerto 8080
app.listen(8080, () => console.log('Server up!'))


