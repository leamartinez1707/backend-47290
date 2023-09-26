import { Router } from "express";
import { getProducts } from "./products.router.js";
import { cartModel } from "../dao/models/cart.model.js";
import { getProductsFromCart } from "./carts.router.js";
import { productModel } from "../dao/models/product.model.js";

const router = Router()

router.get('/', async (req, res) => {

    let result = await getProducts(req, res)
    if (result.statusCode === 200) {
        const totalPages = []
        let link
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:8080${req.originalUrl}&page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:8080${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }
        res.render("home", {
            products: result.response.payload,
            paginateInfo: {
                hasPrevPage: result.response.hasPrevPage,
                hasNextPage: result.response.hasNextPage,
                previousLink: result.response.previousLink,
                nextLink: result.response.nextLink,
                totalPages
            }
        })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }

})
router.get('/:pid', async (req, res) => {
    let pid = req.params.pid
    let product = await productModel.findById(pid)
    console.log(product)
    if (!product) return res.status(404).json({ status: 'error', error: 'Product was not found' })
    res.status(200).render("productDetail",  product )
})

// LO ESTA RENDERIZANDO CUANDO ENTRO A /PRODUCTS

// router.get('/:cid', async (req, res) => {
//     try {

//         let cart = await getProductsFromCart(req, res)
//         console.log(cart.response.payload.products)
//         res.status(200).render("cart", {
//             cartProducts: cart.response.payload.products,

//         })
//     }
//     catch (error) {
//         console.log(error.message)
//     }
// })


router.get('/realtimeproducts', (req, res) => {

    res.render("realTimeProducts")
})

export default router