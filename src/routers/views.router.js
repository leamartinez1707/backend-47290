import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router()
const productManager = new ProductManager('./products.json')

router.get('/', async (req, res)=> {
    let result = await productManager.getProducts()
    res.render("home", {result})
})
router.get('/realtimeproducts', (req, res) => {

    res.render("realTimeProducts")
})

export default router