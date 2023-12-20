import { Router } from 'express'
import productControl from '../controllers/productControl.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'

const router = Router()

// Ya en app.js se indica que la direccion es /api/products
// , verifyRoles(['admin', 'user', 'public'])
router.get('/', verifyRoles(['admin', 'user', 'premium']), productControl.getProducts)
// verifyRoles(['user', 'admin'])
router.get('/:pid', verifyRoles(['user', 'admin', 'premium']), productControl.getProductByIdController)
router.post('/', verifyRoles(['premium']), productControl.addProductController)
// , verifyRoles(['user'])
router.put('/:pid', verifyRoles(['admin', 'premium']), productControl.updateProductController)
router.delete('/:pid', verifyRoles(['admin', 'premium']), productControl.deleteProductController)

export default router
