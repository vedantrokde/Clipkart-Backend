const express = require('express');
const { addCategory, viewCategories, updateCategory, deleteCategory } = require('../controller/category');
const { requireSignin, adminMiddleware } = require('../controller/middleware');

const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

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

router.post('/category/create', requireSignin, adminMiddleware, upload.single('categoryImage'), addCategory);
router.post('/category/update', requireSignin, adminMiddleware, upload.array('categoryImage'), updateCategory);
router.post('/category/delete', requireSignin, adminMiddleware, deleteCategory);
router.get('/category/all', viewCategories);

module.exports = router;