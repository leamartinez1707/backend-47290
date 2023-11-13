import config from '../config/config.js'

export let Product
export let Cart

switch (config.persistence) {
    case 'MONGO':
        const { default: ProductDao } = await import('./productDao.js')
        const { default: CartDao } = await import('./cartDao.js')
        Product = ProductDao
        Cart = CartDao
        break;
    default:
        break;
}