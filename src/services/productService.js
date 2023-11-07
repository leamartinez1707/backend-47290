import productDao from "../dao/productDao.js"

export default class ProductService {

    constructor() {
        this.productDAO = new productDao()
    }

    getProductsService = async () => {
        return await this.productDAO.getProductsDAO()
    }
    getProductByIdService = async (pid) => {
        return await this.productDAO.getProductByIdDAO(pid)
    }
    addProductService = async (product) => {
        return await this.productDAO.addProductDAO(product)
    }
    updateProductService = async (pid, productToUpdate) => {
        return await this.productDAO.updateProductDAO(pid, productToUpdate)
    }
    deleteProductService = async (pid) => {
        return await this.productDAO.deleteProductDAO(pid)
    }
}