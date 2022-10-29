const express = require('express');
const { initData } = require('../../controller/admin/initData');
const { requireSignin, adminMiddleware } = require('../../controller/middleware')
const router = express.Router()

router.post('/initdata', requireSignin, adminMiddleware, initData);

module.exports = router;