const router = require('express').Router();
const Product = require('../models/Product');

//create product
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get a product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all products
router.get('/', async (req, res) => {
    try {
        let products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update a product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product.username === req.body.username) {
            try {
                const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
                    {
                        $set: req.body,
                    },
                    {
                        new: true
                    }
                );
                res.status(200).json(updatedProduct)
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json('You can update only your product');
        }
        
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delect a product
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product.username === req.body.username) {
            try {
                await product.delete();
                res.status(200).json("Product has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can delete only your product!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router; 