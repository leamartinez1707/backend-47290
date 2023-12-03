import { Router } from "express";
import viewControl from "../controllers/viewControl.js";
import { publicRoutes } from "../middlewares/auth.middlewares.js"
import { verifyRoles } from "../middlewares/auth.middlewares.js";


const router = Router()

router.get('/', publicRoutes, verifyRoles(['user', 'admin']), viewControl.getProductsViewController)
router.get('/:cid', publicRoutes, verifyRoles(['user']), viewControl.getProductsFromCartViewController)
router.get('/product/:pid', publicRoutes, verifyRoles(['user', 'admin']), viewControl.getProductByIdViewController)
router.get('/real/realtimeproducts', publicRoutes, verifyRoles(['admin']), (req, res) => {
    res.render("realTimeProducts")
})



export default router