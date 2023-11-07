import { Router } from "express";
import viewControl from "../controllers/viewControl.js";
import { publicRoutes } from "../middlewares/auth.middlewares.js"

const router = Router()

router.get('/', publicRoutes, viewControl.getProductsViewController)

router.get('/product/:pid', publicRoutes, viewControl.getProductByIdViewController)


router.get('/realtimeproducts', publicRoutes, (req, res) => {

    res.render("realTimeProducts")
})
router.get('/:cid', publicRoutes, viewControl.getProductsFromCartViewController)

export default router