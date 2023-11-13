// import CartDao from "../dao/cartDao.js"

export default class CartRepository {

    constructor(dao) {
        // this.cartDAO = new CartDao()
        this.dao = dao
    }

    // getProductsFromCartService = async (cid) => {
    //     return await this.cartDAO.getAll(cid)
    // }
    // deleteCartService = async (cid) => {
    //     return await this.cartDAO.delete(cid)
    // }
    // updateCartService = async (cid) => {
    //     return await this.cartDAO.update(cid)
    // }
    // createCartService = async () => {
    //     return await this.cartDAO.create()
    // }

    getAll = async (cid) => await this.dao.getAll(cid)
    create = async () => await this.dao.create()
    update = async (cid, data) => await this.dao.update(cid, data)
    delete = async (cid) => await this.dao.delete(cid)
    addToCart = async (cid, pid) => await this.dao.addProductToCart(cid, pid)
    deleteProductFromCartService = async (cid, pid) => await this.dao.deleteProductFromCart(cid, pid)
    updateProductFromCartService = async (cid, pid, data) => await this.dao.updateProductFromCart(cid, pid, data)
}