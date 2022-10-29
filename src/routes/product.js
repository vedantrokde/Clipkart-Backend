const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const { requireSignin, adminMiddleware } = require('../controller/middleware');
const { createProduct, getProductBySlug, getProductById } = require('../controller/product');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
});

const upload = multer({ storage:storage });
router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPictures'), createProduct);
router.get('/products/:slug', getProductBySlug);
router.get('/product/:id', getProductById);

module.exports = router;