import { Router } from 'express'
import cartControl from '../controllers/cartControl.js'

const router = Router()

// Ya en app.js se indica que la direccion es /products
router.get('/:cid', cartControl.getProductsFromCartController)

router.delete('/:cid', cartControl.deleteFromCartController)

router.put('/:cid', cartControl.updateCartController)

router.post('/', cartControl.createCartController)

router.post('/:cid/product/:pid', cartControl.addProductToCartController)

router.delete('/:cid/product/:pid', cartControl.deleteProductFromCartController)

router.put('/:cid/product/:pid', cartControl.updateProductFromCartController)

export default router