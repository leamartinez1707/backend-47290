import { Router } from "express";
import viewControl from "../controllers/viewControl.js";
import { publicRoutes, privateRoutes } from "../middlewares/auth.middlewares.js"
import { verifyRoles } from "../middlewares/auth.middlewares.js";


const router = Router()

router.get('/', publicRoutes, verifyRoles(['user', 'admin', 'premium']), viewControl.getProductsViewController)
router.get('/:cid', publicRoutes, verifyRoles(['user', 'premium']), viewControl.getProductsFromCartViewController)
router.get('/product/:pid', publicRoutes, verifyRoles(['user', 'admin', 'premium']), viewControl.getProductByIdViewController)
router.get('/real/realtimeproducts', publicRoutes, verifyRoles(['user', 'admin', 'premium']), (req, res) => {
    res.render("realTimeProducts")
})


// CORREGIR ESTE ROUTER YA QUE NO DEJA INGRESAR, VERIFICAR LA RUTA /USERS
router.get('/control/data', publicRoutes, verifyRoles(['admin', 'user']), viewControl.getUsers)


export default router