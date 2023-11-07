import { Router } from 'express'
import productControl from '../controllers/productControl.js'

const router = Router()

// Ya en app.js se indica que la direccion es /api/products
router.get('/', productControl.getProducts)

router.get('/:pid', productControl.getProductByIdController)

router.post('/', productControl.addProductController)

router.put('/:pid', productControl.updateProductController)

router.delete('/:pid', productControl.deleteProductController)

export default router
