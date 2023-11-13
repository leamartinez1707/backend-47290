import { Router } from 'express'
import productControl from '../controllers/productControl.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'

const router = Router()

// Ya en app.js se indica que la direccion es /api/products
router.get('/', verifyRoles(['user', 'admin']), productControl.getProducts)
router.get('/:pid', verifyRoles(['user', 'admin']), productControl.getProductByIdController)
router.post('/', verifyRoles(['user']), productControl.addProductController)
router.put('/:pid', verifyRoles(['user']), productControl.updateProductController)
router.delete('/:pid', verifyRoles(['user']), productControl.deleteProductController)

export default router
