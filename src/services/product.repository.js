// import productDao from "../dao/productDao.js"
export default class ProductRepository {

    constructor(dao) {
        this.dao = dao
    }

    // getProductsService = async () => {
    //     return await this.productDAO.getAll()
    // }
    // getProductByIdService = async (pid) => {
    //     return await this.productDAO.getById(pid)
    // }
    // addProductService = async (product) => {
    //     return await this.productDAO.create(product)
    // }
    // updateProductService = async (pid, productToUpdate) => {
    //     return await this.productDAO.update(pid, productToUpdate)
    // }
    // deleteProductService = async (pid) => {
    //     return await this.productDAO.delete(pid)
    // }

    getAll = async () => await this.dao.getAll()
    getById = async (pid) => await this.dao.getById(pid)
    create = async (product) => await this.dao.create(product)
    update = async (pid, productToUpdate) => await this.dao.update(pid, productToUpdate)
    delete = async (pid) => await this.dao.delete(pid)
}