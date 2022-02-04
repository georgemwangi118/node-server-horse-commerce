const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        productImage: {
            type: String,
            default: ""
        },
        productName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);