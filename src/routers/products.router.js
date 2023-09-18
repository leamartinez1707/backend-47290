import { Router } from 'express'
import ProductManager from '../dao/productManager.js'
import { productModel } from '../dao/models/product.model.js'

const router = Router()
const productManager = new ProductManager('./products.json')


// Ya en app.js se indica que la direccion es /api/products
router.get('/', async (req, res) => {

    // const result = await productManager.getProducts()
    let result = await productModel.find().lean()
    const limit = req.query.limit
    if (!limit) return res.status(200).render('home', { result })
    // .json({ status: 'sucess', payload: result })
    if (limit == 0) return res.status(204).send({ status: 'error', error: 'Array is empty' })
    let resultFilt = result.slice(0, limit)
    return res.status(200).render('home', { resultFilt })

})

router.get('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid)
    const result = await productManager.getProductByID(pid)
    if (!result) return res.status(404).send({ status: 'error', error: 'Product does not exists' })
    return res.status(200).json({ status: 'sucess', payload: result })

})

router.post('/', async (req, res) => {

    // const result = await productManager.addProduct(req.body)
    let { title, description, price, code, category, stock, thumbnail } = req.body

    let result = await productModel.create({
        title, description, price, code, category, stock, thumbnail
    })

    if (!result) return res.status(400).send({ status: 'error', error: 'The product could not be added' })
    return res.status(201).send({ status: 'sucess', payload: result })

})
router.put('/:pid', async (req, res) => {

    // const pid = parseInt(req.params.pid)
    let { pid } = req.params
    let productToUpdate = req.body
    // const result = await productManager.updateProduct(pid, req.body)
    if (!productToUpdate.title || !productToUpdate.description || !productToUpdate.price || !productToUpdate.code || !productToUpdate.category || !productToUpdate.stock || !productToUpdate.thumbnail)
        return res.send({ status: 'error', error: 'Incomplete values' })
    let result = await productModel.updateOne({ _id: pid }, productToUpdate)
    if (!result) return res.status(400).send({ status: 'error', error: 'The product could not be updated' })
    return res.status(200).json({ status: 'sucess', payload: result })

})

router.delete('/:pid', async (req, res) => {

    // const pid = parseInt(req.params.pid)
    let { pid } = req.params
    // const result = await productManager.deleteProduct(pid)
    let result = await productModel.deleteOne({ _id: pid })
    if (!result) return res.status(400).send({ status: 'error', error: 'The product could not be deleted' })
    return res.status(200).json({ status: 'sucess', payload: result })
})
export default router