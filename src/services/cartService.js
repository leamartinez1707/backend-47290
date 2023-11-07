import CartDao from "../dao/cartDao.js"

export default class CartService {

    constructor() {
        this.cartDAO = new CartDao()
    }

    getProductsFromCartService = async (cid) => {
        return await this.cartDAO.getProductsFromCart(cid)
    }
    deleteCartService = async (cid) => {
        return await this.cartDAO.deleteCart(cid)
    }
    updateCartService = async (cid) => {
        return await this.cartDAO.updateCart(cid)
    }
    createCartService = async () => {
        return await this.cartDAO.createCart()
    }
    addProductToCartService = async (cid, pid) => {
        return await this.cartDAO.addProductToCart(cid, pid)
    }
    deleteProductFromCartService = async (cid, pid) => {
        return await this.cartDAO.deleteProductFromCart(cid, pid)
    }
    updateProductFromCartService = async (cid, pid, data) => {
        return await this.cartDAO.updateProductFromCart(cid, pid, data)

    }
}