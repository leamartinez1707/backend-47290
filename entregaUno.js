class ProductManager {

    #_products
    constructor() {
        this.#_products = []
    }

    generateID() {
        if (this.#_products.length === 0) return 1
        return this.#_products[this.#_products.length - 1].id + 1
    }
    addProduct(product) {
        // Si el usuario no completa todos los datos, no se agrega el objeto
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {

            return console.error('Error! Complete all fields')
        }
        // Se busca si el codigo del producto a agregar, coincide con alguno de los productos del array
        let foundCode = this.#_products.find(prd => product.code === prd.code)

        // Si el objeto ya existe, se le avisa al usuario
        if (foundCode) {
            return console.error('Error! this product already exists')
        }
        // En caso de que todas las condiciones esten bien, se pushea el objeto al array.
        product.id = this.generateID()
        this.#_products.push(product)
        return console.log('Great! Product added successfully')
    }

    getProducts() {
        if (this.#_products.length == 0) return console.log('Array is empty')
        return this.#_products
    }

    getProductByID(id) {
        this.getProducts()
        const findProduct = this.#_products.find(prd => prd.id === id)
        if (!findProduct) return '[ERROR] Product not found'
        return findProduct
    }
}

const pm = new ProductManager()
// Un producto debe tener las propiedades "title, description, price, thumbnail, code, stock"
// En caso de no agregar todos los datos, el producto no se agregará.

pm.addProduct({ title: 'producto prueba uno', description: 'este es un producto prueba', price: 200, thumbnail: 'sin imagen', code: 'abc123', stock: 25 })
pm.addProduct({ title: 'producto prueba dos', description: '2 este es un producto prueba', price: 3200, thumbnail: 'sin imagen', code: '123bb', stock: 5 })
pm.addProduct({ title: 'producto prueba tres', description: '3 producto prueba', price: 400, thumbnail: '3 sin imagen', code: 'abc1ff23', stock: 15 })

// console.log(pm.getProducts())
console.log(pm.getProductByID(3))