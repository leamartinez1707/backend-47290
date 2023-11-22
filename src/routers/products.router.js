import { Router } from 'express'
import productControl from '../controllers/productControl.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'

const router = Router()

// Ya en app.js se indica que la direccion es /api/products
// , verifyRoles(['admin', 'user', 'public'])
router.get('/', productControl.getProducts)
// verifyRoles(['user', 'admin'])
router.get('/:pid', productControl.getProductByIdController)
router.post('/', productControl.addProductController)
// , verifyRoles(['user'])
router.put('/:pid', verifyRoles(['user']), productControl.updateProductController)
router.delete('/:pid', verifyRoles(['user']), productControl.deleteProductController)

export default router
