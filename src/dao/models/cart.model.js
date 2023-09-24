import mongoose from "mongoose";



const cartCollection = 'carts'
const cartSchema = new mongoose.Schema({


    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }],
        default: []
    }
})

mongoose.set('strictQuery', false)

export const cartModel = mongoose.model(cartCollection, cartSchema)