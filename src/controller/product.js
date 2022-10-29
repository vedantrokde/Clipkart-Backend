const Product = require('../models/product');
const Category = require('../models/category');
const slugify = require('slugify');

exports.createProduct = (req, res) => {
    const { name, price, quantity, description, category } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }

    const _product = new Product({
        name: name,
        slug: slugify(name),
        price: price,
        quantity: quantity,
        description: description,
        offer: '',
        productPictures: productPictures,
        reviews: [],
        category: category,
        createdBy: req.user._id
    });

    _product.save((err, product) => {
        if (err) return res.status(400).json({ message: 'Something went wrong', error: err });
        else return res.status(201).json({ message: 'Product added successfully', product: product });
    })
};

exports.getProductBySlug = (req, res) => {
    const { slug } = req.params;

    Category.findOne({ slug: slug })
        .select('_id')
        .exec((err, category) => {
            if (err) return res.status(400).json({ error: err });

            if (category) {
                Product.find({ category: category._id })
                    .exec((err, products) => {
                        if (err) return res.status(400).json({ error: err });
                        if (category.type) {
                            if (products.length > 0) {
                                res.status(200).json({
                                    products,
                                    productsByPrice: {
                                        under5k: products.filter(product => product.price <= 5000),
                                        under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
                                        under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
                                        under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
                                        under30k: products.filter(product => product.price > 20000 && product.price <= 30000)
                                    }
                                });
                            }
                        } else {
                            res.status(200).json({ products });
                        }
                    });
            }
        })
};

exports.getProductById = (req, res) => {
    const { id } = req.params;

    if (id) {
        Product.findOne({ _id: id })
            .exec((err, product) => {
                if (err) return res.status(400).json({ error: err });
                if (product) return res.status(200).json({ product: product });
            })
    } else {
        return res.status(400).json({ error: 'ProductId is invalid/not found.' });
    }
};