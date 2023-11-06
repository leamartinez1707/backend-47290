import { Router } from 'express'
import cartControl from '../controllers/cartControl.js'

const router = Router()

// Ya en app.js se indica que la direccion es /products
router.get('/:cid', cartControl.getProductsFromCart)

router.delete('/:cid', cartControl.deleteFromCart)

router.put('/:cid', cartControl.updateCart)

router.post('/', cartControl.createCart)

router.post('/:cid/product/:pid', cartControl.addProductToCart)

router.delete('/:cid/product/:pid', cartControl.deleteProductFC)

router.put('/:cid/product/:pid', cartControl.updateProductFC)

export default router