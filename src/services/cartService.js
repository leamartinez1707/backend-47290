import CartDao from "../dao/cartDao.js"

export default class CartService {

    constructor() {
        this.cartDAO = new CartDao()
    }

    getPFC = async (cid) => {
        return await this.cartDAO.getProductsFromCart(cid)
    }
    deleteC = async (cid) => {
        return await this.cartDAO.deleteCart(cid)
    }
    updateC = async (cid) => {
        return await this.cartDAO.updateCart(cid)
    }
    createC = async () => {
        return await this.cartDAO.createCart()
    }
    addProductTC = async (cid, pid) => {
        return await this.cartDAO.addProductToCart(cid, pid)
    }
    deleteProductFCService = async (cid, pid) => {
        return await this.cartDAO.deleteProductFromCart(cid, pid)
    }
    updateProductFCService = async (cid, pid, data) => {
        return await this.cartDAO.updateProductFromCart(cid, pid, data)

    }
}