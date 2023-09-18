import mongoose from "mongoose";


const productCollection = 'products'
const productSchema = new mongoose.Schema({

    title: String,
    description: String,
    price: Number,
    code: Number,
    category: String,
    stock: Number,
    thumbnail: Array
})

export const productModel = mongoose.model(productCollection, productSchema);

