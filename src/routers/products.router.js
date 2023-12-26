import { Router } from 'express'
import productControl from '../controllers/productControl.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'

const router = Router()

// Ya en app.js se indica que la direccion es /api/products
router.get('/', verifyRoles(['admin', 'user', 'premium']), productControl.getProducts)
router.get('/:pid', verifyRoles(['user', 'admin', 'premium']), productControl.getProductByIdController)
router.post('/', verifyRoles(['user', 'premium']), productControl.addProductController)
router.put('/:pid', verifyRoles(['admin', 'premium']), productControl.updateProductController)
router.delete('/:pid', verifyRoles(['admin', 'premium']), productControl.deleteProductController)

export default router
