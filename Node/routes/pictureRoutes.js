// routes/pictureRoutes.js - 图片相关路由

const express = require('express')
const router = express.Router()

const videoController = require('../controllers/videoController')
const { optionalAuth } = require('../middleware/authMiddleware')

// 可选认证：解码 JWT（如果存在）
router.use(optionalAuth)

// --- 轮播图 ---
// GET /api/picture/carousel?number=5
router.get('/carousel', videoController.getCarousel)

// 导出路由
module.exports = router
