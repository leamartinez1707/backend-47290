import { Router } from 'express'
import ProductManager from '../productManager.js'
// import uploader from '../utils.js'

const router = Router()
const productManager = new ProductManager('./products.json')


// Ya en app.js se indica que la direccion es /api/products
router.get('/', async (req, res) => {

    const result = await productManager.getProducts()
    const limit = req.query.limit
    if (!limit) return res.status(200).json({ status: 'sucess', payload: result })
    if (limit == 0) return res.status(204).send({ status: 'error', error: 'Array is empty' })
    let resultFilt = result.slice(0, limit)
    return res.status(200).json({ status: 'sucess', payload: resultFilt })
})

router.get('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid)
    const result = await productManager.getProductByID(pid)
    if (!result) return res.status(404).send({ status: 'error', error: 'Product does not exists' })
    return res.status(200).json({ status: 'sucess', payload: result })

})

router.post('/', async (req, res) => {

    const result = await productManager.addProduct(req.body)
    if (!result) return res.status(400).send({ status: 'error', error: 'The product could not be added' })
    return res.status(201).json({ status: 'sucess', payload: result })

})
router.put('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid)
    const result = await productManager.updateProduct(pid, req.body)
    if (!result) return res.status(400).send({ status: 'error', error: 'The product could not be updated' })
    return res.status(200).json({ status: 'sucess', payload: result })

})

router.delete('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid)
    const result = await productManager.deleteProduct(pid)
    if (!result) return res.status(400).send({ status: 'error', error: 'The product could not be deleted' })
    return res.status(200).json({ status: 'sucess', payload: result })
})
export default router