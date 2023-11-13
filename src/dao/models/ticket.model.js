import mongoose from "mongoose";

const ticketCollection = 'tickets'
const ticketSchema = new mongoose.Schema({

    code: { type: String, unique: true, required: true }, // Se autogenera con nanoid en el controller de Cart purchase.
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            price: Number,
            quantity: Number
        }]
    },
    amount: { type: Number },
    purchaser: { type: String, ref: "users" }
}, {
    timestamps: {
        createdAt: 'purchase_datetime'
    }
})

mongoose.set('strictQuery', false)

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel