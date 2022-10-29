const express = require('express');

const { requireSignin, adminMiddleware, upload } = require('../../controller/middleware');
const { createPage, viewPages, getPage } = require('../../controller/admin/page');
const router = express.Router();

router.post('/page/create', requireSignin, adminMiddleware, upload.fields([ {name:'banners'}, {name:'products'} ]), createPage);
router.get('/page/all', requireSignin, adminMiddleware, viewPages);
router.get('/page/:category/:type', getPage);

module.exports = router;