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
}